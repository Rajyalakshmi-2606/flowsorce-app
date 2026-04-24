
import React, { useEffect } from "react";
import { logData } from "../utils/common";
import { Button } from "react-bootstrap";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
    logData("error", error.stack || `${error.name}\n\t${error.message}`);
  }, [error]);

  return (
    <div className="d-flex flex-column justify-content-center w-100 h-100 align-items-center">
      <h2>Something went wrong!</h2>
      <h3>Please try again later</h3>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  );
}
