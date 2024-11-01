import { useEffect, useState } from "react";
import {
  ValidatedFileType,
  ValidationType,
  generateObjectURL,
  removeObjectURL,
  validateFiles,
} from "@/utils";

interface FileHandlerProps {
  rules: ValidationType;
  initFiles?: ValidatedFileType[];
}
const useFileHandler = ({ rules, initFiles }: FileHandlerProps) => {
  const [files, setFiles] = useState<ValidatedFileType[]>(initFiles ?? []);
  const [error, setError] = useState<string>("");

  const handleFileUpload = async (incomingFiles: FileList) => {
    const fileCount = files.length + incomingFiles.length;
    try {
      if (rules.maxFileCount && fileCount > rules.maxFileCount) {
        throw new Error(
          `You can only upload a maximum of ${rules.maxFileCount} file(s).`,
        );
      }
      const fileData = await validateFiles(incomingFiles, rules);
      const validatedFileData = await generateObjectURL(fileData);
      setFiles((prev) => [...prev, ...validatedFileData]);
      setError("");
    } catch (e) {
      if (e instanceof Error) setError(e.message);
    }
  };

  const handleClearAllFiles = () => {
    removeObjectURL(files);
    setFiles(initFiles ?? []);
    setError("");
  };

  const handleClearFile = (fileIdx: number) => {
    const file = files[fileIdx];
    removeObjectURL([file]);
    setFiles((prev) => prev.filter((_, idx) => idx !== fileIdx));
  };

  useEffect(
    () => () => {
      handleClearAllFiles();
    },
    [],
  );

  return {
    files,
    error,
    /** Event that removes one file */
    onClearFile: handleClearFile,
    /** Event that removes all files */
    onClearAllFiles: handleClearAllFiles,
    /** Properties to attach to Upload component */
    registerFileUpload: {
      errorMessage: error,
      showError: !!error,
      onChange: handleFileUpload,
      supportedFileTypes: rules.supportedFileTypes,
    },
  };
};

export { useFileHandler };
