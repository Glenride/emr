"use client";

import Image from "next/image";
import React, { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";

import { convertFileToUrl } from "@/lib/utils";

type FileUploaderProps = {
  files: File[] | undefined;
  onChange: (files: File[]) => void;
};

export const FileUploader = ({ files, onChange }: FileUploaderProps) => {
  const [error, setError] = useState<string>();

  const acceptedFileTypes = useMemo(
    () => ({
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "application/pdf": [".pdf"],
    }),
    []
  );

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(undefined);

    const filteredFiles = acceptedFiles.filter((file) => {
      const isValidType = Object.keys(acceptedFileTypes).includes(file.type);
      const isValidSize = file.size <= maxFileSize;

      if (!isValidType || !isValidSize) {
        setError(
          !isValidType
            ? "Only PDF, PNG, and JPG/JPEG files are allowed."
            : "File size must be 10MB or less."
        );
        return false;
      }

      return true;
    });

    onChange(filteredFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxSize: maxFileSize,
  });

  return (
    <div {...getRootProps()} className="file-upload">
      <input {...getInputProps()} />
      {files && files?.length > 0 ? (
        <Image
          src={convertFileToUrl(files[0])}
          width={1000}
          height={1000}
          alt="uploaded image"
          className="max-h-[400px] overflow-hidden object-cover"
        />
      ) : (
        <>
          <Image
            src="/assets/icons/upload.svg"
            width={40}
            height={40}
            alt="upload"
          />
          <div className="file-upload_label">
            <p className="text-14-regular ">
              <span className="text-green-500">Click to upload </span>
              or drag and drop
            </p>
            <p className="text-12-regular">
              SVG, PNG, JPG or GIF (max. 800x400px)
            </p>
          </div>
        </>
      )}
      {error && <p className="shad-error mt-2 text-center text-sm">{error}</p>}
    </div>
  );
};
