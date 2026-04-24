import inputClasses from "./style.module.css";
import { ChangeEvent, useRef } from "react";
import { selectBotDesign } from "../../store/chat";
import { useAppSelector } from "../../store/hooks";
import paperClipUrl from '../../assets/images/chat/paper-clip.svg';
import React from "react";

export default function MenuItem({
  setAttachFiles,
}: {
  setAttachFiles: (files: File[]) => void;
}) {
  const { attachmentOption } = useAppSelector(selectBotDesign);
  const ref = useRef<HTMLInputElement>(null);

  if (!attachmentOption) {
    return <></>;
  }

  const { maxFiles, accept } = attachmentOption;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setAttachFiles(selectedFiles);

    if (ref.current) ref.current.value = "";
  };

  return (
    <>
      <label
        htmlFor="fileInput"
        className={`btn rounded-0 border-0 my-auto ${inputClasses["input-button"]}`}
      >
        <img
          src={paperClipUrl}
          width={18}
          height={18}
          alt="attach"
          className={inputClasses["input-icons"]}
        />
      </label>
      <input
        id="fileInput"
        type="file"
        className="d-none"
        accept={accept}
        onChange={onChange}
        multiple={maxFiles > 1}
        ref={ref}
      />
    </>
  );
}
