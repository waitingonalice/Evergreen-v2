/* eslint-disable import/no-cycle */
import { GetServerSidePropsContext, NextPageContext } from "next";
import nookies from "nookies";
import { NextSSRType } from "./axios";

export const getCookie = (name: string, ctx?: NextSSRType) => {
  const cookies = nookies.get(ctx);
  return cookies[name] || undefined;
};
export interface CookieSerializeOptions {
  domain?: string | undefined;
  encode?(value: string): string;
  expires?: Date | undefined;
  httpOnly?: boolean | undefined;
  maxAge?: number | undefined;
  path?: string | undefined;
  priority?: "low" | "medium" | "high" | undefined;
  sameSite?: true | false | "lax" | "strict" | "none" | undefined;
  secure?: boolean | undefined;
}
export const setCookie = (
  cookieName: string,
  cookieValue: string,
  options?: CookieSerializeOptions,
  ctx?: NextPageContext | GetServerSidePropsContext,
) => {
  const cookieOptions = {
    ...options,
    path: "/",
    sameSite: "lax",
    secure: true,
    httpOnly: false,
  };
  nookies.set(ctx, cookieName, cookieValue, cookieOptions);
};

export const removeCookie = (name: string, ctx?: NextSSRType) => {
  nookies.destroy(ctx, name);
};
