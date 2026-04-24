"use client";
import {
  selectBotDesign,
  selectClearChatTrigger,
  sendMessage,
} from "../../store/chat";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import React, {
  PropsWithChildren,
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { toast } from "react-toastify";
import { useApi } from '@backstage/core-plugin-api';
import { identityApiRef } from '@backstage/core-plugin-api';
 


const INITIAL: any[] = [];

type ImageContextType = {
  attachments: File[];
  addAttachments: (files: File[]) => void;
  removeAttachment: (index: number) => void;
  clearAllImages: () => void;
  sendMsg: (message: string) => Promise<{
    isNewChat: boolean;
    data: string;
  } | null>;
};

export const ImageContext = createContext<ImageContextType>({
  attachments: INITIAL,
  addAttachments: () => {},
  removeAttachment: () => {},
  clearAllImages: () => {},
  sendMsg: async (_message: string) => {
    return null;
  },
});

const validateFile = (
  file: File,
  existingFiles: File[],
  option: {
    accept: string;
    minFiles: number;
    maxFiles: number;
    fileSize: number;
  }
) => {
  const allowedFileSize = option.fileSize * 1024 * 1024; // 1 MB in bytes

  if (file.size > allowedFileSize) {
    toast.error(
      `${file.name} has a file size greater than ${option.fileSize} MB`,
      {
        position: toast.POSITION.TOP_RIGHT,
      }
    );
    return false;
  }

  const validTypes = option.accept.split(", ");
  if (!validTypes.includes(file.type)) {
    toast.error(
      `${file.name} has invalid file type. Please upload valid file.`,
      {
        position: toast.POSITION.TOP_RIGHT,
      }
    );
    return false;
  }

  const isDuplicate = existingFiles.some(
    (attachment) => attachment.name === file.name
  );

  if (isDuplicate) {
    toast.error(`${file.name} is already uploaded.`, {
      position: toast.POSITION.TOP_RIGHT,
    });
    return false;
  }

  return true;
};


type ImageContextProviderProps = PropsWithChildren<{ backendBaseApiUrl: string }>;

const ImageContextProvider: React.FC<ImageContextProviderProps> = ({ children, backendBaseApiUrl }) => {
  const { attachmentOption } = useAppSelector(selectBotDesign);
  const [attachments, setAttachments] = useState<File[]>(INITIAL);
  const dispatch = useAppDispatch();
  const clearChatTrigger = useAppSelector(selectClearChatTrigger);

  const addAttachments = useCallback(
    (files: File[]) => {
      if (!attachmentOption) return;

      const maxFiles = attachmentOption.maxFiles;
      const currentAttachments = attachments.length;

      // Filter out duplicate files
      const filteredFiles = files.filter((file) =>
        validateFile(file, attachments, attachmentOption)
      );

      const totalFiles = currentAttachments + filteredFiles.length;

      if (totalFiles > maxFiles) {
        toast.error(`You can only upload up to ${maxFiles} files.`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        return;
      }

      setAttachments((prevAttachments) => [
        ...prevAttachments,
        ...filteredFiles,
      ]);
    },
    [attachmentOption, attachments]
  );

  const removeAttachment = useCallback((index: number) => {
    setAttachments((prevAttachments) =>
      prevAttachments.filter((_, i) => i !== index)
    );
  }, []);

  const clearAllImages = useCallback(() => {
    setAttachments(INITIAL);
  }, []);

  useEffect(() => {
    clearAllImages();
  }, [clearAllImages, clearChatTrigger]);

  const identityApi = useApi(identityApiRef);
 
const sendMsg = useCallback(
  async (message: string) => {
    const { token } = await identityApi.getCredentials();
 
    const data = await dispatch(
      sendMessage(
        {
          message,
          uploadFiles: { files: attachments, type: "attach" },
        },
        backendBaseApiUrl,
        token // ✅ Pass token here
      )
    );
 
    setAttachments(INITIAL);
    return data;
  },
  [attachments, dispatch, backendBaseApiUrl, identityApi]
);

  const contextValue: ImageContextType = useMemo(
    () => ({
      attachments,
      addAttachments,
      removeAttachment,
      clearAllImages,
      sendMsg,
    }),
    [attachments, addAttachments, removeAttachment, clearAllImages, sendMsg]
  );

  return (
    <ImageContext.Provider value={contextValue}>
      {children}
    </ImageContext.Provider>
  );
};

export default ImageContextProvider;
