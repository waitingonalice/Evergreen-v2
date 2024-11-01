export const Env = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  SECRET_TOKEN: process.env.SECRET_TOKEN ?? "",
  FRONTEND_URL: process.env.FRONTEND_URL ?? "",
  MINIO_ENDPOINT: process.env.MINIO_URL ?? "",
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY ?? "",
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY ?? "",
};
