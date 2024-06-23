import { ErrorCodeEnum } from "../constants/enums";
import { Request, Response } from "express";

const errorHandler = (error: Error, _: Request, res: Response) => {
  console.error(error.stack);
  res.status(500).json({ code: ErrorCodeEnum.INTERNAL_SERVER_ERROR });
};

export { errorHandler };
