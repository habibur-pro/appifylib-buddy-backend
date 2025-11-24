import express from "express";

import { AuthRoutes } from "../modules/Auth/auth.routes";

import { imageRoutes } from "../modules/Image/Image.route";
import { PostRouter } from "../modules/Post/post.router";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
