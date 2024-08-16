import { Request, Response, NextFunction } from "express";
import { DecodedAuthToken, jwtVerify } from "../utils";
import { TokenExpiredError } from "jsonwebtoken";
import { ErrorCodeEnum } from "../constants/enums";

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ code: ErrorCodeEnum.UNAUTHORIZED });
  }
  try {
    const payload = jwtVerify<DecodedAuthToken>(token);
    res.locals.accountId = payload.id;
    return next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return res.status(401).json({ code: ErrorCodeEnum.TOKEN_EXPIRED });
    }
    return res.status(401).json({ code: ErrorCodeEnum.UNAUTHORIZED });
  }
};
