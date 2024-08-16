import { Router } from "express";
import { verifyUser } from "../../middleware";
import * as SelfHostController from "../../services/selfhost/controller";

const SelfHostRouter = Router();

SelfHostRouter.use(verifyUser);
SelfHostRouter.post("/group", SelfHostController.handleAddNewGroup);
SelfHostRouter.delete("/group/:id", SelfHostController.handleDeleteGroup);
SelfHostRouter.put("/group", SelfHostController.handleUpdateGroup);

SelfHostRouter.get("/", SelfHostController.handleListSelfHost);
SelfHostRouter.post("/", SelfHostController.handleAddNewSelfHost);
SelfHostRouter.put("/", SelfHostController.handleUpdateSelfHost);
SelfHostRouter.delete("/:id", SelfHostController.handleDeleteSelfHost);

export default SelfHostRouter;
