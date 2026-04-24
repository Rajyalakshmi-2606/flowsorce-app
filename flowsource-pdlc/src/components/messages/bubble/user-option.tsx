import React, { useState } from "react";
import bubbleClasses from "./style.module.css";
import { ConversationPairModel, SendMessageInputType } from "../../../types/chat";
import { useAppDispatch } from "../../../store/hooks";
import { sendMessage } from "../../../store/chat";
import { convertUrlsToFiles } from "../../../utils/chat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import editIconUrl from '../../../assets/images/chat/edittext.svg';
import regenerateIconUrl from '../../../assets/images/chat/regenerate.svg';
import copyIconUrl from '../../../assets/images/chat/copytext.svg';
import { useApi, identityApiRef, configApiRef } from '@backstage/core-plugin-api';

type Props = {
  edit: boolean;
  setEdit: (val: boolean) => void;
  chat: ConversationPairModel;
  backendBaseApiUrl: string;
};

const ChatUserOption = ({ edit, setEdit, chat }: Props) => {
  const config = useApi(configApiRef);
  const identityApi = useApi(identityApiRef);
  const backendBaseApiUrl = config.getString('backend.baseUrl') + '/api/flowsource-pdlc/pdlc';
  const [copyOk, setCopyOk] = useState(false);
  const dispatch = useAppDispatch();
  const sendHandler = async () => {
    setEdit(false);

    const msgData: SendMessageInputType = { message: chat.prompt };

    if (chat.files) {
      const files = await convertUrlsToFiles(chat.files);
      msgData.uploadFiles = { files, type: "attach" };
    }

    // Use backendBaseApiUrl as the backend API URL
    if (!backendBaseApiUrl) {
      alert("Backend API URL is not set. Please check your configuration.");
      return;
    }
    const { token } = await identityApi.getCredentials();
    dispatch(sendMessage(msgData, backendBaseApiUrl, token));
  };
  const changeTextHandler = () => {
    setEdit(true);
  };
  const copyHandler = (chat: ConversationPairModel) => {
    navigator.clipboard.writeText(chat.prompt);

    setCopyOk(true);
    setTimeout(() => {
      setCopyOk(false);
    }, 500);
  };

  // new or on going conversation
  if (chat.id === null) return <></>;

  return (
    <>
      <span
        className={`mx-2 mt-1 ms-auto d-flex cursor-pointer ${bubbleClasses["chat_user_icon"]}`}
      >
        {!edit && (
          <img
            src={editIconUrl}
            alt="edit"
            width={16}
            height={16}
            onClick={changeTextHandler}
          />
        )}
      </span>
      <span
        className={`mx-2 mt-1 d-flex cursor-pointer ${bubbleClasses["chat_user_icon"]}`}
      >
        {!edit && (
          <img
            src={regenerateIconUrl}
            alt="regenerate"
            width={16}
            height={16}
            onClick={sendHandler}
          />
        )}
      </span>
      <span
        className={`mx-2 mt-1 d-flex cursor-pointer ${bubbleClasses["chat_user_icon"]}`}
        onClick={() => copyHandler(chat)}
      >
        {!copyOk && !edit && (
          <img
            src={copyIconUrl}
            alt="thumb"
            width={16}
            height={16}
          />
        )}
        {copyOk && <FontAwesomeIcon icon={faCheck} />}
      </span>
    </>
  );
};
export default ChatUserOption;
