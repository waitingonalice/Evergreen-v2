/* eslint-disable import/no-cycle */

/* eslint-disable no-param-reassign */
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { jwtDecode } from "jwt-decode";
import { GetServerSidePropsContext, NextPageContext } from "next";
import { RoleEnum, apiRoutes, clientRoutes } from "@/constants";
import { getCookie, removeCookie, setCookie } from "./cookies";
import { nowInUnixSeconds } from "./formatting";

export type NextSSRType = GetServerSidePropsContext | NextPageContext;

interface RefreshTokenResponseType {
  result: string;
}

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
    const factoryHelper = (ctx?: NextSSRType) => {
      const redirect = (path: string) => {
        if (ctx) {
          ctx.res?.writeHead(302, { Location: path });
          return;
        }
        window.location.href = path;
      };

      return {
        async requestMiddleware(config: InternalAxiosRequestConfig) {
          const authToken = getCookie("token", ctx);
          const refreshToken = getCookie("refresh_token", ctx);
          const controller = new AbortController();
          if (!authToken || !refreshToken) {
            config.signal = controller.signal;
            controller.abort();
            removeCookie("token", ctx);
            removeCookie("refresh_token", ctx);
            redirect(`${clientRoutes.auth.login}?expired=true`);
            return config;
          }

          const decodedAuthToken = jwtDecode<AuthToken>(authToken);
          const { exp } = decodedAuthToken;
          const now = nowInUnixSeconds();

          if (now < exp) return config;
          const response = await axios.post<RefreshTokenResponseType>(
            apiRoutes.v1.auth.refreshToken,
            { token: refreshToken },
          );

          const { result } = response.data;
          setCookie("token", result, undefined, ctx);
          config.headers.Authorization = authToken;
          return config;
        },

        async responseMiddleware(error: AxiosError) {
          if (error.response?.status === 401) {
            removeCookie("token", ctx);
            removeCookie("refresh_token", ctx);
            redirect(`${clientRoutes.auth.login}?expired=true`);
          }
          return Promise.reject(error);
        },
      };
    };

    const axiosHelper = factoryHelper(ctx);

    const axiosClient = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    axiosClient.interceptors.request.use(axiosHelper.requestMiddleware);
    axiosClient.interceptors.response.use(
      (response) => response,
      axiosHelper.responseMiddleware,
    );

    this.axios = axiosClient;
  }

  get client() {
    return this.axios;
  }
}

export { AxiosFactory };
