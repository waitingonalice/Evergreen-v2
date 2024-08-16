import { Router } from "express";
import { verifyUser } from "../../middleware";

const MonitoringRouter = Router();

MonitoringRouter.use(verifyUser);
MonitoringRouter.get("/", (_, res) =>
  res.status(200).json({ message: "Monitoring is up!" }),
);

export default MonitoringRouter;
