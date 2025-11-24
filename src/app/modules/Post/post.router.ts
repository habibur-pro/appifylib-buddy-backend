import { Router } from "express";
import { PostController } from "./post.controller";
import auth from "../../middlewares/auth";
import fileUploaderCloud from "../../../helpars/fileUploaderCloud";
import { parseBodyData } from "../../middlewares/parseBodyData";

const router = Router();

router.get("/feed", auth(), PostController.feed);
router.get("/my-posts", auth(), PostController.getMyAllPost);

router.post(
  "/",
  auth(),
  fileUploaderCloud.upload.single("thumbnail"),
  parseBodyData,
  PostController.createPost
);  

export const PostRouter = router;
