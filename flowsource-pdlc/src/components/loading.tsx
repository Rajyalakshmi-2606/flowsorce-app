import React from "react";
import { Spinner } from "react-bootstrap";

export default function Loading() {
  return (
    <div className="d-flex flex-column justify-content-center w-100 h-100 align-items-center">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}
