import React, { PropsWithChildren, useEffect, useRef } from "react";
import ChatBubble from "./bubble/page";
import ChatLoading from "./loading";
import messagesClass from "./style.module.css";
import ClearChatPopup from "../clear-chat-popup";
import { useAppSelector } from "../../store/hooks";
import {
  selectChatLoading,
  selectConversation,
  selectChatStreaming,
  selectBotDesign,
  selectDisableChatInput,
} from "../../store/chat";
import InitialMessage from "./initial/initial-message";
import { CitationModel, ConversationPairModel } from "../../types/chat";
import HelpPopover from "../help-popup";
import ToolTipContainer from "../tooltip-container";
import WarningPopover from "../warning-popup";
import helpIconUrl from "../../assets/images/chat/helpIcon.png";

type Props = {
  setCitationContent?: (obj: CitationModel | null) => void;
  backendBaseApiUrl: string;
};

const ChatMessages: React.FC<PropsWithChildren<Props>> = (props) => {
  const bottomEl = useRef<HTMLDivElement>(null);

  const conversation = useAppSelector(selectConversation);
  const loading = useAppSelector(selectChatLoading);
  const disableChatInput = useAppSelector(selectDisableChatInput);
  const isStreaming = useAppSelector(selectChatStreaming);
  const { helpContent, warningContent, botname } =
    useAppSelector(selectBotDesign);

  useEffect(() => {
    if (bottomEl)
      // Scrolls to the specified div to be in view
      bottomEl.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  return (
    <div className={` ${messagesClass["chat_messages"]}`} id="chat_messages">
      <div className={`${messagesClass["header-container"]}`}>
        {props.children}
        <div className={`d-flex flex-row justify-content-end align-items-center gap-3 ${messagesClass["model-title"]}`}>  
          <div className="d-flex align-items-center" style={{ minWidth: 90 }}>
            <ClearChatPopup from="MESSAGE" />
          </div>
          <ToolTipContainer toolTipKey="chatOptions">
            <img
              src={helpIconUrl}
              alt="help"
              height={26}
              width={26}
              className="cursor-pointer"
              style={{ cursor: "pointer"}}
              onClick={() =>
                !loading &&
                !disableChatInput &&
                props.setCitationContent &&
                props.setCitationContent({ type: "faq", data: "" })
              }
            />
          </ToolTipContainer>
          <HelpPopover
            content={helpContent}
            className={"px-2 cursor-pointer lh-1"}
          />
          {warningContent && (
            <WarningPopover
              content={warningContent}
              className={"px-2 cursor-pointer lh-1"}
            />
          )}
          <div className="my-auto">
            <span>{botname}</span>
          </div>
        </div>
      </div>
      {conversation.length > 0 &&
        conversation.map((chat: ConversationPairModel, i: number) => (
          <ChatBubble
            {...(props.setCitationContent ? { setCitationContent: props.setCitationContent } : {})}
            chat={chat}
            backendBaseApiUrl={props.backendBaseApiUrl}
            key={`id_${chat.id}__index_${i}`}
          />
        ))}
      {loading && !isStreaming && <ChatLoading />}
      <div ref={bottomEl}></div>
      {conversation.length === 0 && <InitialMessage />}
    </div>
  );
};

export default ChatMessages;
