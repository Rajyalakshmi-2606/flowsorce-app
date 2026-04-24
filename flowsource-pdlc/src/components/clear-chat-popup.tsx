import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import messagesClass from "./messages/style.module.css";
import { useState } from "react";
import { clearConversation } from "../store/chat/conversation/slice";
import { useAppDispatch } from "../store/hooks";
import deleteIconUrl from '../assets/images/chat/deleteIcon.svg';
import clearChatBinUrl from '../assets/images/clear-chat-bin.svg';

const ClearChatPopup = (props: { from: "HISTORY" | "MESSAGE" }) => {
  const dispatch = useAppDispatch();
  const [show, setShow] = useState(false);

  const hideHandler = () => setShow(false);
  const clearHandler = () => {
    dispatch(clearConversation({}));
    setShow(false);
    // router.push("/");
  };

  return (
    <>
      {props.from === "HISTORY" && (
        <img
          src={deleteIconUrl}
          alt="delete"
          width={24}
          height={24}
          className="mx-2"
          onClick={() => setShow(true)}
        />
      )}
      {props.from === "MESSAGE" && (
        <span
          onClick={() => setShow(true)}
          className={`cursor-pointer ${messagesClass["clear-icon"]}`}
          id="clearChatHistory"
          style={{ cursor: 'pointer' }}
        >
          <span className="me-3 p-2 border rounded">New chat</span>
        </span>
      )}
      <Modal
        show={show}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className={messagesClass["chat-clear-close"]}>
          <FontAwesomeIcon
            icon={faTimes}
            className="cursor-pointer"
            onClick={hideHandler}
          />
        </div>
        <div className="d-flex flex-row py-3">
          <div className={messagesClass["clear-chat-bin"]}>
            <img
              src={clearChatBinUrl}
              alt="clear bin"
              width={80}
              height={80}
            />
          </div>
          <div className={`ps-3 ${messagesClass["clear-chat-content"]}`}>
            <Modal.Body className="pb-0">
              <h4>Clear Chat History?</h4>
              <p>
                Do you want to clear the chat history now? This cannot be
                undone.
              </p>
            </Modal.Body>
            <Modal.Footer
              className={`${messagesClass["clear-chat-footer"]} pt-0`}
            >
              <Button className="rounded-0" onClick={hideHandler}>
                No
              </Button>
              <Button className="rounded-0" onClick={clearHandler}>
                Yes
              </Button>
            </Modal.Footer>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default ClearChatPopup;
