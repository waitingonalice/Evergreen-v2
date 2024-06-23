import { Router } from "express";
import SelfHostRouter from "./selfhost";
import MonitoringRouter from "./monitoring";

export const V1Router = Router();

V1Router.use("/services", SelfHostRouter);
V1Router.use("/monitoring", MonitoringRouter);
