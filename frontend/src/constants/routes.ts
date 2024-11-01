const endpoint = process.env.NEXT_PUBLIC_AUTH_ENDPOINT;
const notificationEndpoint = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT;

const authEndpointV1 = `${endpoint}/api/v1`;
const backendEndpointV1 = `${notificationEndpoint}/api/v1`;

export const clientRoutes = {
  root: "/",
  admin: {
    index: "/admin",
    create: "/admin/create",
    cv: {
      index: "/admin/cv",
      edit: (id: string) => `/admin/cv/${id}`,
    },
    records: "/admin/records",
  },
  auth: {
    login: "/login",
    logout: "/logout",
    register: "/register",
    verifyEmail: "/verify-email",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
  },
};

export const apiRoutes = {
  v1: {
    account: {
      me: `${authEndpointV1}/account/me`,
    },
    auth: {
      login: `${authEndpointV1}/auth/login`,
      register: `${authEndpointV1}/auth/register`,
      verifyEmail: `${authEndpointV1}/auth/verify-email`,
      forgotPassword: `${authEndpointV1}/auth/forgot-password`,
      resetPassword: `${authEndpointV1}/auth/reset-password`,
      resendEmail: `${authEndpointV1}/auth/confirmation-email`,
      refreshToken: `${authEndpointV1}/auth/refresh-token`,
    },
    cv: {
      create: `${authEndpointV1}/cv/create`,
      get: (id: string) => `${authEndpointV1}/cv/${id}`,
    },
    records: {
      list: `${authEndpointV1}/records`,
      download: (bucket: string, filename: string) =>
        `${authEndpointV1}/records/download/${bucket}/${filename}`,
    },
    services: {
      group: `${backendEndpointV1}/services/group`,
      index: `${backendEndpointV1}/services`,
    },
  },
};
