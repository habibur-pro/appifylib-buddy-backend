import express from "express";

import { AuthRoutes } from "../modules/Auth/auth.routes";

import { imageRoutes } from "../modules/Image/Image.route";
import { PostRouter } from "../modules/Post/post.router";
import { CommentRouter } from "../modules/Comment/comment.router";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },

  {
    path: "/files",
    route: imageRoutes,
  },
  {
    path: "/posts",
    route: PostRouter,
  },
  {
    path: "/comments",
    route: CommentRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
