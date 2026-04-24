import React, { useContext } from "react";
import { useApi, configApiRef } from '@backstage/core-plugin-api';

import messagesClass from "../style.module.css";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  selectBotDesign,
  selectInitialQuestion,
  sendMessage,
} from "../../../store/chat";
import BubbleContainer from "../bubble/container";
import DropzoneContainer from "./dropzone";
import { useChatNavigationHook } from "../../hooks/chat-navigate-hook";
import QuestionButton from "../../question-btn";
import { ImageContext } from "../../context/image-context";

const ChatInitial = () => {
  const dispatch = useAppDispatch();
  const { showUploadFile, botMessage, faqTitle } =
    useAppSelector(selectBotDesign);
  const initialQuestions = useAppSelector(selectInitialQuestion);
  const chatNavigate = useChatNavigationHook();
  const context = useContext(ImageContext);

  const sendHandler = async (message: string) => {
    const res = await context.sendMsg(message);
    chatNavigate(res);
  };
  const config = useApi(configApiRef);
  const backendBaseApiUrl = config.getString('backend.baseUrl') + '/api/flowsource-pdlc/pdlc';
  const sendFile = async (file: File) => {
    const res = await dispatch(
      sendMessage({ uploadFiles: { files: [file], type: "initial" } }, backendBaseApiUrl)
    );
    if (res) chatNavigate(res);
  };

  if (showUploadFile) {
    return (
      <>
        <BubbleContainer type="bot" maxWidth={true} classes={"chat-initial"}>
          <DropzoneContainer sendFile={sendFile} {...showUploadFile} />
        </BubbleContainer>
      </>
    );
  }

  return (
    <>
      <div className={messagesClass["init-container"]}>
        {initialQuestions.length > 0 && (
          <div className="row mx-0">
            <div className={` col-12 ${messagesClass["init-header"]}`}>
              {faqTitle || "Sample queries you can ask"}
            </div>
            {initialQuestions.slice(0, 4).map((question, i) => (
              <div className="col-6 py-1" key={`question-${i}`}>
                <QuestionButton
                  sendPrompt={sendHandler}
                  data={question}
                  className={messagesClass["send-init-btn"]}
                />
              </div>
            ))}
          </div>
        )}
        {botMessage && (
          <div className="row mx-0">
            <div className="col-12 pt-3">
              <b>{botMessage}</b>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatInitial;
