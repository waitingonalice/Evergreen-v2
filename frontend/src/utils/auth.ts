/* eslint-disable import/no-cycle */
import axios from "axios";
import { NextPageContext } from "next";
import { RoleEnum, apiRoutes } from "@/constants";
import { AxiosFactory, NextSSRType } from "./axios";
import { removeCookie, setCookie } from "./cookies";
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

export const AUTH_KEY = "token";
export const REFRESH_KEY = "refresh-token";
export const getUser = async (ctx?: NextPageContext) => {
  const { client } = new AxiosFactory(ctx);
  try {
    const data = await client.get<UserResponse>(apiRoutes.v1.account.me);
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
    setCookie(AUTH_KEY, result);
  }

  return result;
};

export const removeCookieTokens = (ctx?: NextSSRType) => {
  removeCookie(AUTH_KEY, ctx);
  removeCookie(REFRESH_KEY, ctx);
};
