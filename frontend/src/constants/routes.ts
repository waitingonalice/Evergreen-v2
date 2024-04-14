const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_URL;
const endpointV1 = `${endpoint}/api/v1`;
export const clientRoutes = {
  root: "/",
  auth: {
    admin: {
      login: "/admin/login",
      forgotPassword: "/admin/verify",
      resetPassword: "/admin/reset-password",
      register: "/admin/register",
    },
    login: "/login",
    logout: "/logout",
    register: "/register",
    verify: "/verify",
    forgotPassword: "/forgot-password",
    resetPassword: "/set-password",
  },
  profile: { index: "/profile" },
};

export const apiRoutes = {
  v1: {
    auth: {
      register: `${endpointV1}/auth/register`,
    },
  },
};
