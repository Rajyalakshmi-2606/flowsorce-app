import { BotDesignLayout } from "../types/bots";

export const APP_NAME: { name: string; sup?: boolean }[] = [
  { name: "Agent Assist" },
];
export const FOOTER_TEXT =
  "Cognizant Technology Solutions, 2023 - 2024 * Powered by SPE.";

export const BANNER_IMG_SRC = "/images/landingPage/bannerimg.png";

export const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
} as const;

export const SESSION_LOG_LEVEL_KEY = "loglevel";

export const DEFAULT_LOG_LEVEL = "error";

export const DEFAULT_DESIGN_MODEL: BotDesignLayout = {
  botname: "",
  initialDisabled: false,
  showUploadFile: null,
  attachmentOption: null,
  botMessage: null,
  faqTitle: null,
  citationType: "default",
  initialQuestions: [],
  botAPI: {
    isSession: false,
    isStreaming: false,
    containsSource: false,
  },
  helpContent: "",
  description: "",
  warningContent: "",
};
