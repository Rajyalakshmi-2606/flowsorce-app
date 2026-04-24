import React from "react";
import bubbleClasses from "./style.module.css";
import { useRef } from "react";
import { sendMessage } from "../../../store/chat";
import { useAppDispatch } from "../../../store/hooks";
import { useApi, identityApiRef, configApiRef } from '@backstage/core-plugin-api';
import { FileImage, SendMessageInputType } from "../../../types/chat";
import { convertUrlsToFiles } from "../../../utils/chat";

type Props = {
  edit: boolean;
  setEdit: (value: boolean) => void;
  currentValue: string;
  currentFiles?: FileImage[] | null;
};
const EditUserOption = ({
  edit,
  setEdit,
  currentValue,
  currentFiles,
}: Props) => {
  const config = useApi(configApiRef);
  const identityApi = useApi(identityApiRef);
  const backendBaseApiUrl = config.getString('backend.baseUrl') + '/api/flowsource-pdlc/pdlc';
  const ref = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const sendHandler = async () => {
    const value = (ref.current!.value || "").trim();
    if (value === "" || value === currentValue) {
      setEdit(false);
      return;
    }
    const msgData: SendMessageInputType = { message: value };

    if (currentFiles) {
      const files = await convertUrlsToFiles(currentFiles);
      msgData.uploadFiles = { files, type: "attach" };
    }

    if (!backendBaseApiUrl) {
      alert("Backend API URL is not set. Please check your configuration.");
      setEdit(false);
      return;
    }
    const { token } = await identityApi.getCredentials();
    dispatch(sendMessage(msgData, backendBaseApiUrl, token));
    setEdit(false);
  };
  const cancelTextHandler = () => {
    ref.current!.value = currentValue;
    setEdit(false);
  };

  return (
    <p>
      <input
        type="text"
        defaultValue={currentValue}
        autoFocus={true}
        className={bubbleClasses["chat-user-input"]}
        ref={ref}
      />
      {edit && (
        <div className={bubbleClasses["edit-user-option"]}>
          <button
            className={`mx-2 ms-auto cursor-pointer ${bubbleClasses["chat_user_button"]} ${bubbleClasses["save"]}`}
            onClick={sendHandler}
          >
            Save
          </button>
          <button
            className={`mx-2 py-1 cursor-pointer ${bubbleClasses["chat_user_button"]} ${bubbleClasses["cancel"]}`}
            onClick={cancelTextHandler}
          >
            Cancel
          </button>
        </div>
      )}
    </p>
  );
};

export default EditUserOption;
