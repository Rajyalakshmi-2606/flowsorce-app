import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BotDesignLayout, PromptUrlModel } from "../../types/bots";
import { DEFAULT_DESIGN_MODEL } from "../../constants/common";
import { UserDataModel } from "../../types/user";

// Define a type for the slice state
export interface AppState {
  design: BotDesignLayout;
  url: PromptUrlModel;
  user: UserDataModel | null;
}

// Define the initial state using that type
const initialState: AppState = {
  design: DEFAULT_DESIGN_MODEL,
  url: {
    initial: "",
    prompt: "",
  },
  user: null,
};

export const AppSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setDesignModel: (state: AppState, action: PayloadAction<BotDesignLayout>) => {
      state.design = action.payload;
    },
    setUrls: (state: AppState, action: PayloadAction<PromptUrlModel>) => {
      state.url = action.payload;
    },
    setUserDetails: (state: AppState, action: PayloadAction<UserDataModel | null>) => {
      state.user = action.payload;
    },
  },
});

export const { setDesignModel, setUrls, setUserDetails } = AppSlice.actions;

export default AppSlice.reducer;
