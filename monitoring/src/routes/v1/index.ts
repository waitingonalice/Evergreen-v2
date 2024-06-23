import { Router } from "express";
import ServicesRouter from "./services";
import MonitoringRouter from "./monitoring";

export const V1Router = Router();

V1Router.use("/services", ServicesRouter);
V1Router.use("/monitoring", MonitoringRouter);
