export type PromptResponse = {
  answer: string;
  sources?: { [key: string]: string }[];
  Error?: boolean;
};

// Create a new interface for the chat history item
export type ConversationPairModel = {
  id: number | null; // null=new item to be updated, positive=updated, 0 = error
  prompt: string;
  response: PromptResponse | null;
  createdat: string;
  files?: FileImage[] | null;
};
export type FileImage = { fileName: string; fileUrl: string | null };

export type CitationModel = {
  type: "source" | "faq";
  data: string;
};

export type UploadType = {
  type: "attach" | "initial";
  files: File[];
};

export type SendMessageInputType =
  | {
      message: string;
      uploadFiles?: UploadType;
    }
  | {
      message?: string;
      uploadFiles: UploadType;
    };

export type ApiRequestType = {
  query: string;
  sessionId: string;
  userId: string;
  images?: { format: string; content: number[] }[];
};
