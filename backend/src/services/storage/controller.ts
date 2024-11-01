/* eslint-disable @typescript-eslint/no-unused-vars */
import { tryCatch } from "../../utils/errorHandler";
import { Request, Response } from "express";
import StorageService from "./s3";

const handleGeneratePresignedUrl = tryCatch(
  async (req: Request, res: Response) => {
    const { username } = res.locals;
    const { bucket, name, size, type } = req.body;
    const storageService = new StorageService({ username });

    return res
      .status(200)
      .json({ result: storageService.generatePresignedPutUrl(bucket, name) });
  },
);

export { handleGeneratePresignedUrl };
