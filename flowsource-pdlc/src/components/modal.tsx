import React from "react";
import { Modal } from "react-bootstrap";
import classes from "./style.module.css";

type CommonModalProps = {
  imageUrl: string | null;
  imageName: string;
  showmodal: boolean;
  hide: () => void;
};
const CommonModal: React.FC<CommonModalProps> = ({
  imageUrl,
  imageName,
  showmodal,
  hide,
}) => (
  <Modal show={showmodal} onHide={hide} id="imageModal" className={`${classes["enlarged-modal"]} overflow-hidden`} centered>
    <Modal.Header className="py-1" closeButton>
      {<Modal.Title className="fs-6">{imageName}</Modal.Title>}
    </Modal.Header>
    <Modal.Body className="justify-content-center d-flex align-items-center">
      {imageUrl && (
        <img
          alt="image not found "
          src={imageUrl}
          className={classes["enlarged-image"]}
          height={50}
          width={50}
        />
      )}
    </Modal.Body>
  </Modal>
);

export default CommonModal;
