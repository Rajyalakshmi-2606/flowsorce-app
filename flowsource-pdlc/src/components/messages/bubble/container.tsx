import React, { PropsWithChildren } from "react";
import messagesClass from "../style.module.css";
import botIconUrl from "../../../assets/images/chat/Bot1.svg";
import profileImgUrl from "../../../assets/images/chat/profile.png";

type Props = {
  type: "bot" | "user";
  maxWidth?: boolean;
  classes?: string;
};

const BubbleContainer: React.FC<PropsWithChildren<Props>> = ({
  children,
  type,
  maxWidth,
  classes,
}) => {
  const avatarImgSrc =
    type === "user" ? profileImgUrl : botIconUrl;

  const wrapperClass = type === "user" ? "chat_message_right" : "";

  return (
    <div
      className={`chat_message_wrapper ${
        messagesClass["chat_message_wrapper"]
      } ${messagesClass[wrapperClass]} ${messagesClass[classes!]}`}
    >
      <div className={messagesClass["chat_user_avatar"]}>
        {/* Render the profile image or initials */}
        <img
          src={avatarImgSrc}
          className="md-user-image rounded-circle"
          alt="image"
          width={30}
          height={30}
        />
      </div>
      <ul
        className={` chat_message ${messagesClass["chat_message"]} ${
          maxWidth ? "w-100" : ""
        }`}
      >
        <li className={maxWidth ? "w-100" : ""}>{children}</li>
      </ul>
    </div>
  );
};

export default BubbleContainer;
