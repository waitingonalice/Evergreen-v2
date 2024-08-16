import jwt from "jsonwebtoken";
import { Env } from "./environment";

export interface DecodedAuthToken {
  id: string;
  email: string;
  active: boolean;
  country: string;
  role: string;
  exp: number;
}

const jwtVerify = <T>(token: string) =>
  jwt.verify(token, Env.SECRET_TOKEN, { algorithms: ["HS256"] }) as T;

export { jwtVerify };
