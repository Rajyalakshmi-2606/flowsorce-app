import { combineReducers, configureStore } from "@reduxjs/toolkit";
import chatConversationReducer from "./chat/conversation/slice";
import appReducer from "./app/slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      chat: chatReducer,
      app: appReducer,
    },
  });
};

const chatReducer = combineReducers({
  conversation: chatConversationReducer,
});

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
