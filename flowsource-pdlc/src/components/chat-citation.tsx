import React from "react";
import CustomMarkDown from "../components/markdown-renderer/page";
import messagesClass from "./messages/style.module.css";
import { useAppSelector } from "../store/hooks";
import {
  selectBotDesign,
  selectInitialQuestion,
} from "../store/chat";
import { CitationModel } from "../types/chat";
import { useChatNavigationHook } from "./hooks/chat-navigate-hook";
import QuestionButton from "./question-btn";
import { useContext } from "react";
import { ImageContext } from "./context/image-context";

const ChatCitation = ({
  citationContent,
  closeCitation,
}: {
  citationContent: CitationModel | null;
  closeCitation: () => void;
}) => {
  const { citationType, faqTitle } = useAppSelector(selectBotDesign);
  const initialQuestions = useAppSelector(selectInitialQuestion);
  const chatNavigate = useChatNavigationHook();
  const context = useContext(ImageContext);

  if (!citationContent) return <></>;

  if (citationContent.type === "source" && citationType !== "structured") {
    return <CustomMarkDown content={citationContent.data} />;
  }

  if (citationContent.type === "source" && citationType === "structured") {
    return (
      <>
        {citationContent.data.split(/\n/g).map((str, i) => {
          const colonIndex = str.indexOf(":");
          if (colonIndex === -1)
            return (
              <p key={i} className="mb-0">
                {str}
              </p>
            );

          return (
            <p key={i} className="mb-0">
              <b>{str.substring(0, colonIndex + 1)}</b>{" "}
              {str.substring(colonIndex + 1)}
            </p>
          );
        })}
      </>
    );
  }
  if (citationContent.type === "faq") {
    const sendHandler = async (message: string) => {
      closeCitation();
      const res = await context.sendMsg(message);
      chatNavigate(res);
    };
    return (
      <div className="row mx-0">
        <div className={` col-12 ${messagesClass["init-header"]}`}>
          {faqTitle || "Sample queries you can ask"}...
        </div>
        {initialQuestions.map((question, i) => (
          <div className="col-12 py-1" key={`question-${i}`}>
            <QuestionButton
              sendPrompt={sendHandler}
              data={question}
              className={`${messagesClass["send-init-btn"]} ${messagesClass["citation-init"]}`}
            />
          </div>
        ))}
      </div>
    );
  }
  return <></>;
};

export default ChatCitation;
