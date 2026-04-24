import { ConversationPairModel, PromptResponse } from "../../../types/chat";
import { PayloadAction, createSlice, Slice } from "@reduxjs/toolkit";

export type ChatConversationState = {
  loading: boolean;
  isStreaming: boolean;
  conversation: ConversationPairModel[];
  clearChatTriggerEvent: boolean; // the value is not tracked. it is purely used to track even change
};

const initialState: ChatConversationState = {
  loading: false,
  isStreaming: false,
  conversation: [],
  clearChatTriggerEvent: false,
};

export const ChatConversationSlice: Slice<ChatConversationState> = createSlice({
  name: "chatConversation",
  initialState,
  reducers: {
    toggleLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    toggleIsStreaming: (state, action: PayloadAction<boolean>) => {
      state.isStreaming = action.payload;
    },
    addConversation: (
      state,
      action: PayloadAction<ConversationPairModel[]>
    ) => {
      state.conversation = state.conversation.concat(action.payload);
    },
    updateConversationWithResponse: (
      state,
      action: PayloadAction<PromptResponse>
    ) => {
      const selectedItem = state.conversation.find((_: any) => _.id === null);
      if (!selectedItem) return;
      selectedItem.response = action.payload;
      return;
    },
    updateConversationError: (state, action: PayloadAction<string>) => {
      const selectedItem = state.conversation.find((_ : any) => _.id === null);
      if (!selectedItem) return;
      selectedItem.response = { answer: action.payload };
      selectedItem.id = 0; // 0 denotes that it has error
    },
    updateLastConversationId: (state, action: PayloadAction<number>) => {
      const selectedItem = state.conversation.filter((_ : any) => _.id === null); // only new item
      const length = selectedItem.length;
      if (length !== 0) selectedItem[length - 1].id = action.payload;
    },
    clearConversation: (state) => {
      state.clearChatTriggerEvent = !state.clearChatTriggerEvent;
      state.conversation.forEach((conv: any) =>
        conv.files?.forEach(
          (file: any) => file.fileUrl && URL.revokeObjectURL(file.fileUrl)
        )
      );
      state.conversation = [];
      state.loading = false;
      state.isStreaming = false;
    },
    updateMessageForStream: (state, action: PayloadAction<string>) => {
      const selectedItem = state.conversation.find((_: any) => _.id === null);
      if (!selectedItem) return;
      if (selectedItem.response !== null) {
        selectedItem.response.answer = action.payload;
        return;
      }
      selectedItem.response = { answer: action.payload };
    },
  },
});

export const {
  toggleIsStreaming,
  toggleLoading,
  addConversation,
  updateConversationWithResponse,
  updateConversationError,
  clearConversation,
  updateMessageForStream,
  updateLastConversationId,
} = ChatConversationSlice.actions;

export default ChatConversationSlice.reducer;