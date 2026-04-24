export type BotDesignLayout = {
  botname: string;
  initialDisabled: boolean;
  showUploadFile: null | {
    accept: { [mimeType: string]: string[] };
    fileSize: number;
  };
  attachmentOption: null | {
    accept: string;
    minFiles: number;
    maxFiles: number;
    fileSize: number;
  };
  botMessage: null | string;
  citationType: "default" | "structured";
  faqTitle: null | string;
  initialQuestions: FaqQuestionModel[];
  botAPI: {
    isSession: boolean;
    isStreaming: boolean;
    containsSource: boolean; // relavent only when streaming
  };
  helpContent: string;
  description: string;
  warningContent: string;
};

export type PromptUrlModel = {
  initial: string;
  prompt: string;
};

export type FaqQuestionModel =
  | string
  | {
      display?: string;
      prompt: string;
      tooltip?: string;
    };
