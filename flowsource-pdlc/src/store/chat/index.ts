import { RootState } from "../store";
import { sendMessage } from "./conversation/action";
import { BotDesignLayout, FaqQuestionModel } from "../../types/bots";

export const selectBotDesign = (state: RootState): BotDesignLayout => {
  const design = state.app.design;
  return design;
};

export const selectConversation = (state: RootState) =>
  state.chat.conversation.conversation;

export const selectConversationLength = (state: RootState) =>
  state.chat.conversation.conversation.length;

export const selectChatLoading = (state: RootState) =>
  state.chat.conversation.loading;

export const selectChatStreaming = (state: RootState) =>
  state.chat.conversation.isStreaming;

export const selectInitialQuestion = (state: RootState): FaqQuestionModel[] => {
  const { initialQuestions } = selectBotDesign(state);
  return initialQuestions;
};

export const selectClearChatTrigger = (state: RootState) =>
  state.chat.conversation.clearChatTriggerEvent;

export const selectDisableChatInput = (state: RootState) => {
  const loading = selectChatLoading(state);
  const conversation = selectConversation(state);
  const { initialDisabled } = selectBotDesign(state);
  const isError = conversation[conversation.length - 1]?.id === 0;
  const chatDisabled =
    (conversation.length === 0 && initialDisabled) || isError;
  return chatDisabled || loading;
};

export { sendMessage };
