import { Router } from "express";
import { verifyUser } from "../../middleware";
import * as storageService from "../../services/storage/controller";

const StorageRouter = Router();

StorageRouter.use(verifyUser);
StorageRouter.post("/presigned-url", storageService.handleGeneratePresignedUrl);

export default StorageRouter;
