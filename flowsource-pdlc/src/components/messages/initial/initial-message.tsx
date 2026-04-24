import React from "react";
import messagesClass from "../style.module.css";
import { useAppSelector } from "../../../store/hooks";
import { selectBotDesign } from "../../../store/chat";
import botIconUrl from '../../../assets/images/chat/Bot1.svg';

const InitialMessage = () => {
  const { description } = useAppSelector(selectBotDesign);
  if (!description) return <></>;
  return (
    <div
      className={`d-flex flex-row justify-items-center ${messagesClass["bot-img-bg"]}`}
    >
      <img
        src={botIconUrl}
        className={messagesClass["bot-img"]}
        alt="image"
        width={40}
        height={40}
      />
      <p className={`${messagesClass["message"]}`}>{description}</p>
    </div>
  );
};

export default InitialMessage;
