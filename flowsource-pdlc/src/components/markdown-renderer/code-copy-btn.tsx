import React from "react";
import classes from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const CodeCopyBtn = ({ children }: any) => {
  const [copyOk, setCopyOk] = React.useState(false);

  const handleClick = (_e: any) => {
    navigator.clipboard.writeText(children.props.children);

    setCopyOk(true);
    setTimeout(() => {
      setCopyOk(false);
    }, 500);
  };

  return (
    <div className={classes["code-copy-btn"]}>
      {copyOk && <FontAwesomeIcon icon={faCheck} color="#000" />}
      {!copyOk && <img
        src="/images/chat/copytext.svg"
        alt="thumb"
        width={16}
        height={16}
        onClick={handleClick}
      />}
    </div>
  );
};

export const Pre = ({ children }: any) => (
  <pre className={classes["blog-pre"]}>
    <CodeCopyBtn>{children}</CodeCopyBtn>
    {children}
  </pre>
);

export default Pre;
