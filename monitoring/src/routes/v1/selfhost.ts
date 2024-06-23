import { Router } from "express";
import { verifyUser } from "../../middleware";

const SelfHostRouter = Router();

SelfHostRouter.use(verifyUser);
SelfHostRouter.get("/", (_, res) =>
  res.status(200).json({ message: "Services is up!" }),
);

export default SelfHostRouter;
