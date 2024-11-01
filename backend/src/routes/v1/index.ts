import { Router } from "express";
import SelfHostRouter from "./selfhost";
import MonitoringRouter from "./monitoring";
import StorageRouter from "./storage";

export const V1Router = Router();

V1Router.use("/services", SelfHostRouter);
V1Router.use("/monitoring", MonitoringRouter);
V1Router.use("/storage", StorageRouter);
