import { nanoid } from "nanoid";
import { FileContentTypeEnum } from "@waitingonalice/utilities";
import { DEFAULT_FILE_SIZE } from "@/constants/file";
import { FileType } from "@/types/fileRecords";

export interface ValidationType {
  supportedFileTypes: FileContentTypeEnum[];
  maxFileCount?: number;
  fileSize?: number;
}

export interface ValidatedFileType extends FileType {
  error?: string | null;
  blob?: File;
  id?: string;
}

const fileSignatures = {
  [FileContentTypeEnum.JPEG]: ["ffd8ffe0", "ffd8ffe1"],
  [FileContentTypeEnum.PNG]: ["89504e47"],
  [FileContentTypeEnum.SVG]: ["3c737667"],
  [FileContentTypeEnum.CSV]: ["2c637265"],
};

const imageMimeTypes = [
  FileContentTypeEnum.JPEG,
  FileContentTypeEnum.PNG,
  FileContentTypeEnum.JPG,
  FileContentTypeEnum.SVG,
];

const videoMimeTypes = [
  FileContentTypeEnum.MP4,
  FileContentTypeEnum.MOV,
  FileContentTypeEnum.AVI,
];

const isImage = (type: string) =>
  imageMimeTypes.includes(type as FileContentTypeEnum);

const isVideo = (type: string) =>
  videoMimeTypes.includes(type as FileContentTypeEnum);

const checkFileSize = (
  size: number,
  maxSize: number = DEFAULT_FILE_SIZE,
): boolean => size < maxSize;

const checkSupportedFileTypes = (
  type: string,
  supportedFileTypes: FileContentTypeEnum[],
) => supportedFileTypes.includes(type as FileContentTypeEnum);

const checkFileSignature = async (file: File) => {
  const { type } = file;
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer.slice(0, 4));
  let fileMagic = "";
  for (let i = 0; i < bytes.length; i += 1) {
    const bitSignature = bytes[i].toString(16);
    fileMagic += bitSignature;
  }
  const fileSignatureList = fileSignatures[type as keyof typeof fileSignatures];

  return fileSignatureList.includes(fileMagic);
};

const checkFileListSignatures = (files: FileList) => {
  const promises = [...files].map((file) => checkFileSignature(file));
  return Promise.all(promises);
};

const validateFiles = async (files: FileList, rules: ValidationType) => {
  const validatedFileData: ValidatedFileType[] = [];
  const { supportedFileTypes, fileSize } = rules;

  const fileListSignatures = await checkFileListSignatures(files);

  for (let i = 0; i < files.length; i += 1) {
    // Validate uploaded files
    const { size, type, name } = files[i];

    const isFileSizeValid = checkFileSize(size, fileSize);

    const isFileTypeValid = checkSupportedFileTypes(type, supportedFileTypes);

    const isFileSignatureValid = fileListSignatures[i];

    const fileData = {
      id: nanoid(),
      size,
      type: type as FileContentTypeEnum,
      name,
      blob: files[i],
    };

    if (!isFileSizeValid) {
      validatedFileData.push({
        ...fileData,
        error: "File size is too large",
      });
    } else if (!isFileTypeValid) {
      validatedFileData.push({
        ...fileData,
        error: "File type is not supported",
      });
    } else if (!isFileSignatureValid) {
      validatedFileData.push({
        ...fileData,
        error: "File signature is not supported",
      });
    } else {
      validatedFileData.push(fileData);
    }
  }

  return validatedFileData;
};

const generateObjectURL = async (validatedFileData: ValidatedFileType[]) => {
  const generateURL = (file: ValidatedFileType) =>
    new Promise<ValidatedFileType>((resolve, reject) => {
      try {
        if (file.error) {
          resolve(file);
          return;
        }
        const url = file.blob && URL.createObjectURL(file.blob);
        resolve({ ...file, src: url });
      } catch (err) {
        reject(err);
      }
    });

  const updateFileDataPromise = validatedFileData.map((file) =>
    isImage(file.type) || isVideo(file.type) ? generateURL(file) : file,
  );
  const updateFileData = await Promise.all(updateFileDataPromise);
  return updateFileData;
};

const removeObjectURL = (files: ValidatedFileType[]) => {
  files.forEach((file) => file.src && URL.revokeObjectURL(file.src));
};

export { validateFiles, generateObjectURL, removeObjectURL };
