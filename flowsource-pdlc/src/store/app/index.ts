import { RootState } from "../store";

export const selectDesignModel = (state: RootState) => state.app.design;

export const selectUrl = (state: RootState) => state.app.url;

export const selectUser = (state: RootState) => state.app.user;
