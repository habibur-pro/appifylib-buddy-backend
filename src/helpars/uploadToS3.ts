import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import ApiError from "../errors/ApiErrors";
import httpStatus from "http-status";
import config from "../config";

// =============== Cloudflare R2 Config ===============
const s3 = new S3Client({
  region: "auto",
  endpoint: config.s3.r2_endpoint!,
  credentials: {
    accessKeyId: config.s3.r2_access_id!,
    secretAccessKey: config.s3.r2_secret_key!,
  },
});

// =============== Upload to R2 ===============
export const uploadFileToSpace = async (file: Express.Multer.File) => {
  if (!config.s3.r2_bucket) {
    throw new Error("R2_BUCKET is not defined in environment variables.");
  }
  if (!config.s3.r2_public_url) {
    throw new Error(
      "R2_PUBLIC_DOMAIN is missing (example: https://pub-xxxxx.r2.dev)."
    );
  }

  const slug = file.originalname
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-\.]/g, "");

  const key = `tourismhub/${Date.now()}_${slug}`;

  const params = {
    Bucket: "antask",
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read" as ObjectCannedACL,
  };

  try {
    await s3.send(new PutObjectCommand(params));

    // R2 public URL
    return `${config.s3.r2_public_url}/${key}`;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// =============== Delete Single File ===============
export const deleteFromCloud = async (fileUrl: string): Promise<void> => {
  try {
    if (!config.s3.r2_bucket) {
      throw new Error("R2_BUCKET is missing.");
    }

    const key = fileUrl.replace(`${config.s3.r2_public_url}/`, "");

    await s3.send(
      new DeleteObjectCommand({
        Bucket: config.s3.r2_bucket,
        Key: key,
      })
    );

    console.log(`Deleted successfully: ${fileUrl}`);
  } catch (error: any) {
    console.error(`Error deleting file: ${fileUrl}`, error);
    throw new Error(`Failed to delete file: ${error?.message}`);
  }
};

// =============== Delete Multiple Files ===============
export const deleteMultipleFromCloud = async (
  fileUrls: string[]
): Promise<void> => {
  try {
    if (!Array.isArray(fileUrls) || fileUrls.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "No file URLs provided");
    }

    const objectKeys = fileUrls.map((url) =>
      url.replace(`${config.s3.r2_public_url}/`, "")
    );

    const command = new DeleteObjectsCommand({
      Bucket: process.env.R2_BUCKET!,
      Delete: { Objects: objectKeys.map((Key) => ({ Key })) },
    });

    await s3.send(command);

    console.log("Deleted multiple files successfully.");
  } catch (error: any) {
    console.error(`Error deleting files:`, error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Failed to delete files: ${error?.message}`
    );
  }
};
