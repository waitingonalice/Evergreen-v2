/* eslint-disable import/no-cycle */

/* eslint-disable no-param-reassign */
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { jwtDecode } from "jwt-decode";
import { GetServerSidePropsContext, NextPageContext } from "next";
import Router from "next/router";
import { RoleEnum, apiRoutes, clientRoutes } from "@/constants";
import {
  AUTH_KEY,
  REFRESH_KEY,
  generateAuthToken,
  removeCookieTokens,
} from "./auth";
import { getCookie } from "./cookies";
import { nowInUnixSeconds } from "./formatting";

export type NextSSRType = NextPageContext | GetServerSidePropsContext;

interface AuthToken {
  exp: number;
  email: string;
  active: boolean;
  country: string;
  role: RoleEnum;
}

class AxiosFactory {
  private axios: AxiosInstance;

  constructor(ctx?: NextSSRType) {
    const authRoutes = Object.values(apiRoutes.v1.auth);

    const isLoginPage =
      ctx &&
      "pathname" in ctx &&
      ctx?.pathname?.includes(clientRoutes.auth.login);

    const redirect = (path: string) => {
      if (ctx?.res) {
        ctx.res.writeHead(302, { Location: path });
        ctx.res.end();
      } else {
        Router.replace(path);
      }
    };

    async function requestMiddleware(config: InternalAxiosRequestConfig) {
      const authToken = getCookie(AUTH_KEY, ctx);
      const refreshToken = getCookie(REFRESH_KEY, ctx);
      const controller = new AbortController();
      if (authRoutes.includes(config.url || "")) return config;
      if (!authToken || !refreshToken) {
        config.signal = controller.signal;
        controller.abort();
        removeCookieTokens(ctx);
        if (!isLoginPage) redirect(`${clientRoutes.auth.login}?expired=true`);
        return config;
      }

      const decodedAuthToken = jwtDecode<AuthToken>(authToken);
      const { exp } = decodedAuthToken;
      const now = nowInUnixSeconds();

      if (now > exp) {
        const refreshedAuthToken = await generateAuthToken(refreshToken);
        config.headers.Authorization = refreshedAuthToken;
      } else {
        config.headers.Authorization = authToken;
      }
      return config;
    }

    async function responseMiddleware(error: AxiosError) {
      if (error.response?.status === 401) {
        removeCookieTokens(ctx);
        if (!isLoginPage) redirect(`${clientRoutes.auth.login}?expired=true`);
      }
      return Promise.reject(error);
    }

    const axiosClient = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    axiosClient.interceptors.request.use(requestMiddleware);
    axiosClient.interceptors.response.use(
      (response) => response,
      responseMiddleware,
    );

    this.axios = axiosClient;
  }

  get client() {
    return this.axios;
  }
}

export { AxiosFactory };
