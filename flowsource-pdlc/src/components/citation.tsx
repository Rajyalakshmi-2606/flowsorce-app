"use client";
import React, { PropsWithChildren, useCallback, useEffect, useRef } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useOutsideAlerter } from "./hooks/click-outside-hook";
import ReactDOM from "react-dom";
import classes from "./style.module.css";
import messagesClass from "./messages/style.module.css";

type Props = {
  showCitation: boolean;
  hideCitation: () => void;
  className?: string;
  disableClickOutside?: boolean;
};

const OverlayCitation: React.FC<PropsWithChildren<Props>> = ({
  showCitation,
  children,
  hideCitation,
  className,
  disableClickOutside = false,
}) => {
  const hideHandler = useCallback(() => {
    hideCitation();
  }, [hideCitation]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<Element | null>(null);
  useOutsideAlerter(wrapperRef, hideHandler);
  useEffect(() => {
    targetRef.current = document.getElementById("citation-portal-modal");
  }, []);

  let wrapperClass = classes.citation;
  if (showCitation) wrapperClass += " " + classes.open;
  if (className) wrapperClass += " " + className;

  const content = (
    <div className={wrapperClass} ref={disableClickOutside ? null : wrapperRef}>
      <div className={classes.citationClose}>
        <FontAwesomeIcon
          icon={faTimes}
          className="cursor-pointer"
          onClick={hideHandler}
        />
      </div>
      <div className={messagesClass.citationContent}>
        {children}
      </div>
    </div>
  );
  if (showCitation && targetRef.current) {
    return ReactDOM.createPortal(content, targetRef.current!);
  }
  return null;
};

export default OverlayCitation;
