
import React from "react";
import messagesClass from "./style.module.css";
import botIconUrl from '../../assets/images/chat/Bot1.svg';
import loadingUrl from '../../assets/images/loading.svg';

const ChatLoading = () => {
  return (
    <div className={messagesClass["chat_message_wrapper"]}>
      <div className={messagesClass["chat_user_avatar"]}>
        <img
          src={botIconUrl}
          alt="bot"
          height={40}
          width={40}
          className="chatbot-icon"
        />
      </div>
      <ul className={messagesClass["chat_message"]}>
        <li>
          <p>
            <img
              src={loadingUrl}
              alt="Loading"
              width={100}
              height={25}
            />
          </p>
        </li>
      </ul>
    </div>
  );
};
export default ChatLoading;
