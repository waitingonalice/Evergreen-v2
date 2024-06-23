import { Router } from "express";
import { verifyUser } from "../../middleware";

const ServicesRouter = Router();

ServicesRouter.use(verifyUser);
ServicesRouter.get("/", (_, res) =>
  res.status(200).json({ message: "Services is up!" }),
);

export default ServicesRouter;
