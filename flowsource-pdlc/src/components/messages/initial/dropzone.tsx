import React, { useMemo } from "react";
import { DropzoneProps, FileRejection } from "react-dropzone";
import messagesClass from "../style.module.css";
import { toast } from "react-toastify";
import Dropzone from "react-dropzone";
import { logData } from "../../../utils/common";

type Props = {
  sendFile: (files: File) => void;
  accept: { [mimeType: string]: string[] };
  fileSize: number;
};

const DropzoneContainer: React.FC<Props> = ({ sendFile, accept, fileSize }) => {
  const maxDropFileSize = fileSize * 1024 * 1024;

  const onRejections = (files: FileRejection[]) => {
    // Log file rejection details
    logData("error", {
      message: "File(s) rejected during upload",
      rejectedFiles: files.map((file) => ({
        fileName: file.file.name,
        errors: file.errors.map((err) => ({
          code: err.code,
          message: err.message,
        })),
      })),
    });

    const err = files[0].errors[0];
    let errmsg = files[0].errors[0].message; // default error message
    if (err.code === "file-too-large") {
      errmsg = err.message.replace(
        `${maxDropFileSize} bytes`,
        `${fileSize} MB`
      );
    }
    toast.error(errmsg);
  };

  const acceptedFormatText = useMemo(() => {
    // Log accepted file formats
    const formats = Object.values(accept).flat().join(", ");
    logData("info", {
      message: "Accepted file formats generated",
      formats,
    });
    return formats;
  }, [accept]);

  const props: DropzoneProps = {
    accept,
    maxFiles: 1,
    maxSize: maxDropFileSize,
    onDropRejected: onRejections,
    onDropAccepted: (files) => {
      // Log details of accepted file(s)
      logData("info", {
        message: "File accepted for upload",
        fileName: files[0].name,
        fileSize: files[0].size,
      });
      sendFile(files[0]);
    },
  };

  return (
    <Dropzone {...props}>
      {({ getRootProps, getInputProps, isDragActive }) => (
        <section className={`container px-0`}>
          <div
            {...getRootProps({
              className: `py-5 ${messagesClass["dropzone"]} ${
                isDragActive ? messagesClass["zone-enter"] : ""
              }`,
            })}
          >
            <input {...getInputProps()} />
            <p>
              Click to select files, or drag &apos;n&apos; drop some files here
            </p>
            <em>(Only {acceptedFormatText} files will be accepted)</em>
          </div>
        </section>
      )}
    </Dropzone>
  );
};

export default DropzoneContainer;
