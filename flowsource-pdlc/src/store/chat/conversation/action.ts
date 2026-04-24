import { AppDispatch, RootState } from "../../../store/store";
import { selectBotDesign, selectConversation } from "..";
import {
  toggleLoading,
  addConversation,
  updateLastConversationId,
  updateConversationWithResponse,
  updateConversationError,
  toggleIsStreaming,
} from "./slice";
import { formatDate } from "../../../utils/chat";
import { defaultPromptCall } from "../../../utils/api/chat";
import {
  ConversationPairModel,
  PromptResponse,
  UploadType,
  SendMessageInputType,
  ApiRequestType,
} from "../../../types/chat";
import { toast } from "react-toastify";
import { logData } from "../../../utils/common";
import { selectUser } from "../../../store/app";
import { v4 as uuidv4 } from "uuid";

const addNewConversationAction = (prompt: string, uploadFiles?: UploadType) => {
  return async (dispatch: AppDispatch) => {
    logData("info", `Adding a new conversation - ${prompt}`);
    const conversationObj: ConversationPairModel = {
      id: null,
      prompt,
      response: null,
      createdat: formatDate(),
    };
    if (uploadFiles?.type === "attach" && uploadFiles.files) {
      conversationObj.files = uploadFiles.files.map((_) => ({
        fileName: _.name,
        fileUrl: URL.createObjectURL(_),
      }));
    }
    // logData("info", "Dispatching new conversation-" +conversationObj);
    logData("info", {
      message: "Dispatching new conversation",
      conversation: conversationObj,
    });

    dispatch(addConversation([conversationObj]));
  };
};

const readImageAsBytes = (file: File): Promise<number[] | null> =>
  new Promise((resolve) => {
    const reader = new FileReader();
    // Read the file as an ArrayBuffer
    reader.readAsArrayBuffer(file);

    reader.onload = (e: ProgressEvent<FileReader>): void => {
      const arrayBuffer = e.target?.result as ArrayBuffer;

      // Convert the ArrayBuffer to a byte array
      const byteArray = new Uint8Array(arrayBuffer);

      // To convert byteArray to a regular array of numbers
      const bytes = Array.from(byteArray);
      resolve(bytes);
    };

    reader.onerror = () => {
      logData("error", `Unable to convert image to base64 - ${file.name}`);
      resolve(null);
    };
  });


const getPromptRequestBody = (
  query: string,
  sessionId: string,
  uploadFiles?: UploadType
) => {
  return async (
    _dispatch: AppDispatch,
    getState: () => RootState
  ): Promise<ApiRequestType> => {
    logData("info", {
      message: "Generating prompt request body",
      query,
      sessionId,
    });

    const user = selectUser(getState());
    logData("debug", {
      message: "Selected user details",
      userName: user?.name || "Anonymous",
    });

    const reqData: ApiRequestType = {
      query,
      sessionId,
      userId: user?.name || "Anonymous",
    };
    if (!uploadFiles?.files?.length) {
      logData("info", {
        message: "No files to upload; returning request data - ",
        reqData,
      });
      return reqData;
    }
    const files = uploadFiles?.files || [];
    const fileBytesPromise: Promise<number[] | null>[] = files.map(readImageAsBytes);
    const fileBase64List = await Promise.all(fileBytesPromise);
    const filtered: { format: string; content: number[] }[] = [];
    fileBase64List.forEach((content, i) => {
      if (content && files[i]?.type)
        filtered.push({ format: files[i].type, content });
    });
    reqData.images = filtered;
    return reqData;
  };
};


const getFormattedResponse = (
  res: { [x: string]: { [key: string]: string }[] | string }[] | null
): PromptResponse | null => {
  if (res === null) {
    logData("warn", { message: "Received null response, returning null" });
    return null;
  }

  try {
    const formattedRes: PromptResponse = {
      answer: "",
      sources: [],
    };

    logData("info", {
      message: "Formatting response data",
      responseLength: res.length,
    });

    res.forEach(
      (item: { [x: string]: { [key: string]: string }[] | string }) => {
        const answer = item["response"];
        const citation = item["citation"];

        // Log each item being processed
        logData("debug", { message: "Processing item", item });

        if (citation && Array.isArray(citation)) {
          formattedRes.sources = citation;
          logData("debug", { message: "Sources added", sources: citation });
        }
        if (answer && typeof answer === "string") {
          formattedRes.answer = answer;
          logData("debug", { message: "Answer found and set", answer });
        }
      }
    );

    if (!formattedRes.answer) {
      logData("error", { message: "No answer found in the response" });
      throw new Error("No answer in the response");
    }

    logData("info", {
      message: "Response formatting successful",
      formattedRes,
    });
    return formattedRes;
  } catch (error) {
    logData("error", {
      message: "Error while parsing data from response",
      error,
    });
    throw new Error("Error while parsing data from response \n Error:" + error);
  }
};


const postPromptQuestion = (
  message: string,
  chatId: string,
  backendBaseApiUrl: string,
  uploadFiles?: UploadType,
  backstageToken?: string,
  userId?: string
) => {
  return async (
    dispatch: AppDispatch,
    getState: () => RootState
  ): Promise<PromptResponse | null> => {
    logData("info", {
      message: "Posting prompt question (new backend flow)",
      chatId,
      promptmessage: message,
    });

    const url = backendBaseApiUrl;
    const user = userId || selectUser(getState())?.name || "Anonymous";
    const reqData = await dispatch(
      getPromptRequestBody(message, chatId, uploadFiles)
    );
    reqData.userId = user;
    const reqBody = JSON.stringify(reqData);

    logData("info", { message: "Request body generated for prompt", reqBody });

    const result = await defaultPromptCall(url, reqBody, backstageToken);

    logData("info", {
      message: "Received response from backend /aws endpoint",
      result,
    });

    const formattedResponse = getFormattedResponse(result);
    if (formattedResponse) {
      logData("info", {
        message: "Successfully formatted response",
        formattedResponse,
      });
    } else {
      logData("error", { message: "Failed to format response", result });
    }
    return formattedResponse;
  };
};

const validateAndGetMessage = (
  data: SendMessageInputType,
  state: RootState
) => {
  logData("info", { message: "Validating and extracting message", data });

  const { attachmentOption } = selectBotDesign(state);

  // Log if attachmentOption is present or not
  if (attachmentOption) {
    logData("info", { message: "Attachment option found", attachmentOption });
  } else {
    logData("warn", { message: "No attachment option found in bot design" });
  }

  // Check if the number of files is less than the minimum required
  if (
    attachmentOption &&
    data.uploadFiles?.type === "attach" &&
    data.uploadFiles.files.length > 0 &&
    data.uploadFiles.files.length < attachmentOption.minFiles
  ) {
    const minFiles = attachmentOption.minFiles;
    logData("warn", {
      message: `Insufficient files uploaded`,
      uploadedFiles: data.uploadFiles.files.length,
      minFiles,
    });

    toast.error(`You must upload at least ${minFiles} files.`, {
      position: toast.POSITION.TOP_RIGHT,
    });
    return null;
  }

  // If a message is present, return it
  if (data.message) {
    logData("info", { message: "Message found", messagedata: data.message });
    return data.message;
  }

  // Check if it's an initial file upload and log the file name
  if (data.uploadFiles?.type === "initial" && data.uploadFiles?.files[0]) {
    logData("info", {
      message: "Initial file upload detected",
      fileName: data.uploadFiles.files[0].name,
    });
    return `"${data.uploadFiles?.files[0].name}" file processing`;
  }

  // Log when no message or valid file data is found
  logData("warn", { message: "No message or valid file data found" });

  return;
};


export const sendMessage = (data: SendMessageInputType, backendBaseApiUrl: string, backstageToken?: string) => {
  return async (
    dispatch: AppDispatch,
    getState: () => RootState
  ): Promise<{
    isNewChat: boolean;
    data: string;
  } | null> => {
    const message = validateAndGetMessage(data, getState());
    if (!message) return null;

    const initState = getState();
    const userId = selectUser(initState)?.name || "Anonymous";
    dispatch(toggleIsStreaming(false));
    dispatch(addNewConversationAction(message, data.uploadFiles)); // id= null
    dispatch(toggleLoading(true));

    const urlParams = new URLSearchParams(window.location.search);
    const searchParamId = urlParams.get("id");
    const isNewChat = !searchParamId || searchParamId === "new-chat";
    let chatId: string | null = isNewChat ? null : searchParamId;

    const { botAPI, showUploadFile } = selectBotDesign(initState);
    const initConversation = selectConversation(initState);

    if (!chatId) {
      if (
        botAPI.isSession &&
        Boolean(showUploadFile) &&
        initConversation.length > 0
      ) {
        const cMsg = "Please try uploading the file again";
        dispatch(updateConversationError(cMsg));
        logData("warn", "User tried to give chat for a failed upload");
        dispatch(toggleLoading(false));
        return null;
      }
      chatId = uuidv4();
    }
    if (!chatId) {
      const cMsg = "Something went wrong. Please try again later";
      dispatch(updateConversationError(cMsg));
      logData("warn", "Unable to get ChatId ");
      dispatch(toggleLoading(false));
      return null;
    }

    try {
      const promptResponse = await dispatch(
        postPromptQuestion(message, chatId, backendBaseApiUrl, data.uploadFiles, backstageToken, userId)
      );
      if (!promptResponse) {
        const cMsg = "Something went wrong. Please try again later";
        dispatch(updateConversationError(cMsg));
        return null;
      }
      if (promptResponse.Error) {
        dispatch(updateConversationError(promptResponse.answer));
        return null;
      }

      dispatch(updateConversationWithResponse(promptResponse));
      dispatch(updateLastConversationId(initConversation.length + 1));

      return {
        isNewChat,
        data: chatId,
      };
    } catch (error: any) {
      logData("error", `Error while sending message: ${error?.stack}`);
      const errMsg = "Something went wrong! Please try again later.";
      dispatch(updateConversationError(errMsg));
      return null;
    } finally {
      dispatch(toggleLoading(false));
    }
  };
};