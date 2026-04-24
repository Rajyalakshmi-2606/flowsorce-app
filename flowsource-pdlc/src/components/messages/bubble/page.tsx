import React, { useState } from "react";
import BubbleContainer from "./container";
import EditUserOption from "./edit-user-option";
import ChatUserOption from "./user-option";
import messagesClass from "../style.module.css";
import bubbleClasses from "./style.module.css";
import CustomMarkDown from "../../../components/markdown-renderer/page";
import { CitationModel, ConversationPairModel } from "../../../types/chat";
import CommonModal from "../../modal";
import ToolTipContainer from "../../tooltip-container";
import { useAppSelector } from "../../../store/hooks";
import { selectDisableChatInput } from "../../../store/chat";

type Props = {
  setCitationContent?: (obj: CitationModel | null) => void;
  chat: ConversationPairModel;
  backendBaseApiUrl: string;
};

const ChatBubble: React.FC<Props> = ({ chat, setCitationContent, backendBaseApiUrl }) => {
  const [edit, setEdit] = useState(false);
  const [modelData, setModelData] = useState<{
    fileName: string;
    fileUrl: string;
  } | null>(null);

  const linkClickHandler = (content: string) => {
    if (setCitationContent) {
      setCitationContent({ type: "source", data: content });
    }
  };

  const closeModal = () => {
    setModelData(null);
  };

  const createdat = new Date(chat.createdat + "Z").toLocaleString();
  const disableChatInput = useAppSelector(selectDisableChatInput);
  return (
    <>
      <BubbleContainer type="user">
        <span className={bubbleClasses["chat_user_hover_area"]}>
          {edit && (
            <EditUserOption
              edit={edit}
              setEdit={setEdit}
              currentValue={chat.prompt}
              currentFiles={chat.files}
            />
          )}
          {!edit && <p className="white-space-pre-line">{chat.prompt}</p>}

          {chat.files?.map((file, index) => (
            <React.Fragment key={index}>
              {file.fileUrl && (
                <ToolTipContainer
                  type="message"
                  message="Please click to preview the image"
                >
                  <img
                    src={`${file.fileUrl}`}
                    alt={`attachment ${index}`}
                    className={bubbleClasses["conversation-image"]}
                    onClick={() =>
                      setModelData({
                        fileName: file.fileName,
                        fileUrl: `${file.fileUrl}`,
                      })
                    }
                    width={500} // Specify the width
                    height={500} // Specify the height
                  />
                </ToolTipContainer>
              )}
            </React.Fragment>
          ))}
          {chat.id !== null && !disableChatInput && (
            <span className={bubbleClasses["chat_user_option_wrapper"]}>
              <ChatUserOption edit={edit} setEdit={setEdit} chat={chat} backendBaseApiUrl={backendBaseApiUrl} />
            </span>
          )}
        </span>
        <div className={messagesClass["chat_time"]}>{createdat}</div>
      </BubbleContainer>
      {chat.response && (
        <BubbleContainer type="bot">
          <CustomMarkDown content={chat.response.answer} />

          {chat.response.sources && chat.response.sources.length > 0 && (
            <p>
              <span>SOURCES: </span>
              <span>
                {chat.response.sources.map((ticket, i) => {
                  const [key, value] = Object.entries(ticket)[0];
                  return (
                    <React.Fragment key={key + i}>
                      <button
                        className={`btn btn-link ${bubbleClasses["source-button"]}`}
                        type="button"
                        onClick={() => linkClickHandler(value)}
                      >
                        {key}
                      </button>
                    </React.Fragment>
                  );
                })}
              </span>
            </p>
          )}
          <div className={messagesClass["chat_time"]}>{createdat}</div>
        </BubbleContainer>
      )}
      <CommonModal
        imageUrl={modelData?.fileUrl || ""}
        imageName={modelData?.fileName || ""}
        showmodal={Boolean(modelData)}
        hide={closeModal}
      />
    </>
  );
};

export default ChatBubble;
