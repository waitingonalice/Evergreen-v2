/* eslint-disable import/no-cycle */
import axios from "axios";
import { NextPageContext } from "next";
import { RoleEnum, apiRoutes } from "@/constants";
import { AxiosFactory } from "./axios";
import { getCookie, setCookie } from "./cookies";
import { isBrowser } from "./environment";

export interface UserResponse {
  result: {
    id: string;
    email: string;
    role: RoleEnum;
    country: string;
    active: boolean;
  };
}

interface RefreshTokenResponseType {
  result: string;
}
export const getUser = async (ctx?: NextPageContext) => {
  const token = getCookie("token", ctx);
  if (!token) return null;
  const axios = new AxiosFactory(ctx);
  try {
    const data = await axios.client.get<UserResponse>(apiRoutes.v1.account.me);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const generateAuthToken = async (refreshToken: string) => {
  const response = await axios.post<RefreshTokenResponseType>(
    apiRoutes.v1.auth.refreshToken,
    { token: refreshToken },
  );

  const { result } = response.data;
  if (isBrowser()) {
    setCookie("token", result);
  }

  return result;
};
