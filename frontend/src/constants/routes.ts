const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_URL;
const endpointV1 = `${endpoint}/api/v1`;
export const clientRoutes = {
  root: "/",
  auth: {
    login: "/login",
    logout: "/logout",
    register: "/register",
    verify: "/verify",
    forgotPassword: "/forgot-password",
    resetPassword: "/set-password",
  },
  profile: { index: "/profile" },
  dashboard: "/dashboard",
  codeEditor: {
    index: "/code-editor",
  },
};

export const apiRoutes = {
  auth: {
    register: `${endpoint}/auth/register`,
    verify: (token: string) => `${endpoint}/auth/verify/${token}`,
    login: `${endpoint}/auth/login`,
    refreshToken: `${endpoint}/auth/refresh-token`,
    forgotPassword: `${endpoint}/auth/forgot-password`,
    resetPassword: (token: string) => `${endpoint}/auth/set-password/${token}`,
  },
  user: {
    get: `${endpointV1}/user`,
  },
  collections: {
    addCollection: `${endpointV1}/collections`,
  },
  execute: {
    code: `${endpointV1}/execute`,
  },
};
