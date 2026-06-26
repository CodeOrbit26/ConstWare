import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT || "https://your-account-id.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "placeholder-key-id",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "placeholder-secret-key",
  },
});

export { r2Client };

export async function uploadFileToR2(
  bucketName: string,
  key: string,
  body: Buffer | string | Uint8Array,
  contentType: string
) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  return r2Client.send(command);
}

export async function getFileFromR2(bucketName: string, key: string) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });
  const response = await r2Client.send(command);
  return response.Body;
}

export async function deleteFileFromR2(bucketName: string, key: string) {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });
  return r2Client.send(command);
}
