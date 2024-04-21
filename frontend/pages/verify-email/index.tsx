import React from "react";
import { AxiosError } from "axios";
import { GetServerSideProps } from "next";
import { apiRoutes, clientRoutes } from "@/constants";
import { AxiosFactory } from "@/utils";

export interface VerifyEmailResponse {
  result: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { client } = new AxiosFactory(ctx);

  try {
    const { data } = await client.post<VerifyEmailResponse>(
      apiRoutes.v1.auth.verifyEmail,
      { token: ctx.query.token },
    );
    return {
      props: {},
      redirect: {
        destination: `${clientRoutes.auth.login}?verify-status=${data.result}`,
      },
    };
  } catch (err) {
    if (err instanceof AxiosError) {
      return {
        props: {},
        redirect: {
          destination: `${clientRoutes.auth.verifyEmail}/${
            err.response?.data.detail
          }?email=${encodeURIComponent(ctx.query.email as string)}`,
        },
      };
    }
    return {
      props: {},
      redirect: {
        destination: `${clientRoutes.auth.login}?verify-status=error`,
      },
    };
  }
};

function VerifyEmailPage() {
  return <></>;
}

export default VerifyEmailPage;
