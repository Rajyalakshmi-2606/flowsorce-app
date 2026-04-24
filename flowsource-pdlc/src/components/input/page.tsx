import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import inputClasses from "./style.module.css";
import { useAppSelector } from "../../store/hooks";
import { selectClearChatTrigger, selectDisableChatInput } from "../../store/chat";
import { useChatNavigationHook } from "../hooks/chat-navigate-hook";
import MenuItem from "./menu-item";
import ImageAttachment from "./image-attachment";
import { ImageContext } from "../context/image-context";
import sendEnableUrl from '../../assets/images/chat/send-enable.svg';

const isValid = (value: string) => {
  const tempArr = value.split(" ");
  if (tempArr.length >= 2) return value;
  return "";
};

const ChatInput = () => {
  const [inputText, setInputText] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const chatNavigate = useChatNavigationHook();
  const context = useContext(ImageContext);
  const clearChatTrigger = useAppSelector(selectClearChatTrigger);

  const disableChatInput = useAppSelector(selectDisableChatInput);

  const sendMsg = async () => {
    if (disableChatInput || isSending) return; // Prevent sending if disabled or already sending
    setIsSending(true);
    const value = isValid(ref.current!.value.trim());
    if (value === "") {
      setIsSending(false);
      return;
    }
    try {
      const data = await context.sendMsg(value);
      chatNavigate(data);
      setValue("");
    } finally {
      setIsSending(false);
    }
  };

  const textAreaInputHandler = useCallback(() => {
    const ele = ref.current;
    if (ele) {
      ele.style.height = "0px";
      ele.style.height = ele.scrollHeight + 2 + "px";
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disableChatInput && !isSending) {
        sendMsg();
      }
    }
  };

  const setValue = useCallback(
    (value: string) => {
      ref.current!.value = value;
      setInputText(value);
      textAreaInputHandler();
    },
    [setInputText, textAreaInputHandler]
  );

  useEffect(() => {
    setValue("");
  }, [setValue, clearChatTrigger]);

  return (
    <>
      <ImageAttachment />
      <div className={`${inputClasses["chat_input_box"]} bottom-0 end-0`}>
        <div
          className={`input-group input-group-lg ${
            inputClasses["chat_input_group"]
          } ${disableChatInput ? "disabled-content" : ""}`}
        >
          <MenuItem setAttachFiles={context.addAttachments} />
          <textarea
            id="inputBox"
            className="form-control input-bg rounded-0"
            placeholder="Type here"
            onKeyDown={handleKeyDown}
            disabled={disableChatInput}
            onInput={textAreaInputHandler}
            onChange={(e) => setInputText(e.target.value)}
            ref={ref}
          />
          <button
            className={`btn rounded-0 border-0 my-auto ${inputClasses["input-button"]}`}
            type="button"
            id="button-chat"
            onClick={sendMsg}
            disabled={disableChatInput || isSending || !Boolean(isValid(inputText.trim()))}
          >
            <img
              src={sendEnableUrl}
              width={20}
              height={20}
              alt="send"
              className={inputClasses["input-icons"]}
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatInput;
