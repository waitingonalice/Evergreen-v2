const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_URL;
const endpointV1 = `${endpoint}/api/v1`;
export const clientRoutes = {
  root: "/",
  admin: {
    dashboard: "/admin/dashboard",
    cv: {
      index: "/admin/cv",
      create: "/admin/cv/create",
    },
  },
  auth: {
    login: "/login",
    logout: "/logout",
    register: "/register",
    verifyEmail: "/verify-email",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
  },
  profile: { index: "/profile" },
  dashboard: "/",
};

export const apiRoutes = {
  v1: {
    account: {
      me: `${endpointV1}/account/me`,
    },
    auth: {
      login: `${endpointV1}/auth/login`,
      register: `${endpointV1}/auth/register`,
      verifyEmail: `${endpointV1}/auth/verify-email`,
      forgotPassword: `${endpointV1}/auth/forgot-password`,
      resetPassword: `${endpointV1}/auth/reset-password`,
      resendEmail: `${endpointV1}/auth/confirmation-email`,
      refreshToken: `${endpointV1}/auth/refresh-token`,
    },
  },
};
