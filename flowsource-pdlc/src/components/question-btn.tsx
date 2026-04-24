import React from "react";
import { FaqQuestionModel } from "../types/bots";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import ToolTipContainer from "../components/tooltip-container";

const getPromptMessage = (data: FaqQuestionModel): string => {
  if (typeof data === "string") return data;
  return data.prompt;
};

const getPromptToolTip = (data: FaqQuestionModel): string => {
  if (typeof data === "string") return "";
  return data.tooltip || "";
};

const QuestionButton = ({
  sendPrompt,
  data,
  className = "",
}: {
  sendPrompt: (_: string) => void;
  data: FaqQuestionModel;
  className?: string;
}) => {
  const clickHandler = () => {
    const prompt = getPromptMessage(data);
    sendPrompt(prompt);
  };
  return (
    <ToolTipContainer
      type="message"
      message={getPromptToolTip(data)}
      className="w-100 h-100"
    >
      <button
        type="button"
        className={`btn ${className} d-flex flex-row`}
        onClick={clickHandler}
      >
        <div className="flex-grow-1 my-auto">
          {typeof data === "string" ? data : data.display || data.prompt}
        </div>
        <div className="ps-3 my-auto">
          <FontAwesomeIcon icon={faPaperPlane} />
        </div>
      </button>
    </ToolTipContainer>
  );
};

export default QuestionButton;
