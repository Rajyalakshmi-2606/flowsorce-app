import React, { useContext, useEffect, useMemo, useState } from "react";
import inputClasses from "./style.module.css";
import { ImageContext } from "../context/image-context";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppSelector } from "../../store/hooks";
import { selectDisableChatInput } from "../../store/chat";
import CommonModal from "../modal";
import ToolTipContainer from "../tooltip-container";


const ImageAttachment = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [imageName, setImageName] = useState<string>("");
  const context = useContext(ImageContext);
  const disableChatInput = useAppSelector(selectDisableChatInput);

  const imgSrc = useMemo(() => {
    return context.attachments.map((file) => URL.createObjectURL(file));
  }, [context.attachments]);

  useEffect(() => {
    return () => {
      imgSrc.forEach((src) => URL.revokeObjectURL(src));
    };
  }, [imgSrc]);

  const hideHandler = (index: number) => {
    context.removeAttachment(index);
  };

  const showImageModal = (imageSrc: string, file: File) => {
    setSelectedImage(imageSrc);
    setImageName(file.name);
    setShowModal(true);
  };

  const hideImageModal = () => {
    setShowModal(false);
    setSelectedImage("");
    setImageName("");
  };

  return (
    <>
      {imgSrc.length > 0 && (
        <div
          className={`d-flex flex-row mx-5 mt-3 ${
            disableChatInput ? "disabled-content" : ""
          }`}
        >
          {imgSrc.map((imageSrc: string, index: number) => (
            <div key={index} className="position-relative me-3">
              <div className={`close-icon-div ${inputClasses["img-close"]}`}>
                <FontAwesomeIcon
                  icon={faTimes}
                  className="cursor-pointer"
                  onClick={() => hideHandler(index)}
                />
              </div>
              <ToolTipContainer
                type="message"
                message="Please click to preview the image"
              >
                <img
                  alt="image preview"
                  src={imageSrc}
                  height={50}
                  width={50}
                  className={`${inputClasses["image-preview"]}`}
                  onClick={() =>
                    showImageModal(imageSrc, context.attachments[index])
                  }
                />
              </ToolTipContainer>
            </div>
          ))}
        </div>
      )}
      <CommonModal
        imageUrl={selectedImage}
        imageName={imageName}
        showmodal={showModal}
        hide={hideImageModal}
      />
    </>
  );
};

export default ImageAttachment;
