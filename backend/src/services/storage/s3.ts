import * as Minio from "minio";
import { Env } from "../../utils";

interface StorageServiceProps {
  isPrivate?: boolean;
  username: string;
}

class StorageService {
  client: Minio.Client;
  root: "evergreen" | "evergreen-public";
  username: string;
  constructor({ isPrivate = false, username }: StorageServiceProps) {
    const minioClient = new Minio.Client({
      endPoint: Env.MINIO_ENDPOINT,
      useSSL: true,
      accessKey: Env.MINIO_ACCESS_KEY,
      secretKey: Env.MINIO_SECRET_KEY,
    });

    this.client = minioClient;
    this.root = isPrivate ? "evergreen" : "evergreen-public";
    this.username = username;
  }

  generatePresignedPutUrl(bucket: string, object: string) {
    const path = `${this.username}/${bucket}/${object}`;
    return this.client.presignedPutObject(this.root, path, 24 * 60 * 60);
  }
}

export default StorageService;
