"use client";
import React, { PropsWithChildren, useEffect } from "react";
import { useAppDispatch } from "../store/hooks";
import { SESSION_LOG_LEVEL_KEY, DEFAULT_LOG_LEVEL } from "../constants/common";
import { setDesignModel, setUrls } from "../store/app/slice";
import { PromptUrlModel } from "../types/bots";
import DESIGN_MODEL from "../assets/json/design-model.json";

type Props = {
  logLevel?: string;
  url: PromptUrlModel;
};

const ChatProvider: React.FC<PropsWithChildren<Props>> = ({
  children,
  logLevel,
  url,
}) => {
  const dispatch = useAppDispatch();


  useEffect(() => {
    dispatch(setDesignModel(DESIGN_MODEL as any));
  }, [dispatch]);

  useEffect(() => {
    sessionStorage.setItem(
      SESSION_LOG_LEVEL_KEY,
      logLevel || DEFAULT_LOG_LEVEL
    );
  }, [logLevel]);

  useEffect(() => {
    dispatch(setUrls(url));
  }, [url, dispatch]);

  return <>{children}</>;
};

export default ChatProvider;