const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_URL;
const notificationEndpoint = process.env.NEXT_PUBLIC_NOTIFICATION_ENDPOINT;

const endpointV1 = `${endpoint}/api/v1`;
const notificationEndpointV1 = `${notificationEndpoint}/api/v1`;

export const clientRoutes = {
  root: "/",
  admin: {
    dashboard: "/admin/dashboard",
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
    cv: {
      create: `${endpointV1}/cv/create`,
      get: (id: string) => `${endpointV1}/cv/${id}`,
    },
    records: {
      list: `${endpointV1}/records`,
      download: (bucket: string, filename: string) =>
        `${endpointV1}/records/download/${bucket}/${filename}`,
    },
    monitoring: `${notificationEndpointV1}/monitoring`,
  },
};
