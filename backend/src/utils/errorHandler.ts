import { ErrorCodeEnum } from "../constants/enums";
import { NextFunction, Request, Response } from "express";

class ValueError extends Error {
  code: ErrorCodeEnum;
  constructor(message: string, code: ErrorCodeEnum) {
    super(message);
    this.name = "ValueError";
    this.code = code;
  }
}

const errorHandler = (error: Error, _: Request, res: Response) => {
  console.error(error.stack);
  res.status(500).json({ code: ErrorCodeEnum.INTERNAL_SERVER_ERROR });
};

const tryCatch = (
  fn: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response<any>>,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      if (err instanceof ValueError) {
        const { code, message } = err;
        console.log(err.message);
        return res.status(400).json({ code, message });
      }
      next(err);
    }
  };
};
export { errorHandler, tryCatch, ValueError };
