/* eslint-disable import/no-cycle */

/* eslint-disable no-param-reassign */
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { GetServerSidePropsContext, NextPageContext } from "next";
import { getCookie, removeCookie } from "./cookies";

export type NextSSRType = GetServerSidePropsContext | NextPageContext;

class AxiosFactory {
  private axios: AxiosInstance;

  constructor(ctx?: NextSSRType) {
    const factory = (ctx?: NextSSRType) => ({
      requestMiddleware(config: InternalAxiosRequestConfig) {
        const token = getCookie("admin-token", ctx);
        // TODO: handle token expiration
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      },

      responseMiddleware(error: AxiosError) {
        if (error.response?.status === 401) {
          removeCookie("admin-token", ctx);
          // TODO: handle redirect
        }
        return Promise.reject(error);
      },
    });

    const axiosHelper = factory(ctx);

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
