import { fetchIntercept } from "../../utils/api/common";
import { logData } from "../common";


export const streamFetch = async function* (
  url: string,
  requestBody: BodyInit
) {
  const headers: HeadersInit = {
    Accept: "application/json",
  };
  if (!(requestBody instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  // fetchIntercept common is not used as streaming is handled in different format
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: requestBody,
  });
  if (!response.ok) {
    throw new Error("Network response for stream operation failed");
  }
  const reader = (response.body as ReadableStream<Uint8Array>).getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    const decoded = new TextDecoder().decode(value);
    yield decoded;
  }
};

export const defaultPromptCall = async (
  url: string,
  requestBody: BodyInit,
  backstageToken?: string
): Promise<{ [x: string]: { [key: string]: string }[] | string }[] | null> => {
  const headers: HeadersInit = {
    Accept: "application/json",
  };

  if (!(requestBody instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // Add Backstage identity token if provided
  if (backstageToken) {
    headers["Authorization"] = `Bearer ${backstageToken}`;
  }

  logData("info", {
    message: "Initiating defaultPromptCall",
    url,
    headers,
    hasRequestBody: !!requestBody,
  });

  try {
    const response = await fetchIntercept(url, {
      method: "POST",
      mode: "cors",
      headers,
      body: requestBody,
    });

    if (!response) {
      logData("error", {
        message: "No response received from fetchIntercept",
        url,
      });
      return null;
    }

    logData("info", {
      message: "Response received from fetchIntercept",
      status: response.status,
      statusText: response.statusText,
    });

    try {
      const parsed = JSON.parse(response.body);
      logData("debug", {
        message: "Successfully parsed the API response",
        parsedData: parsed,
      });
      return parsed;
    } catch (error) {
      if (error instanceof Error) {
        logData("error", {
          message: "Error while parsing the Bot API response",
          responseBody: response.body,
          error: error.message,
        });
      } else {
        logData("error", {
          message: "Unexpected error type while parsing response",
          error,
        });
      }
      return null;
    }
  } catch (error) {
    if (error instanceof Error) {
      logData("error", {
        message: "Error during defaultPromptCall execution",
        url,
        error: error.message,
      });
    } else {
      logData("error", {
        message: "Unexpected error type during fetch call",
        error,
      });
    }
    return null;
  }
};
