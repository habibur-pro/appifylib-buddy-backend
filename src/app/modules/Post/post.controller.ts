import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { PostService } from "./post.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { imageService } from "../Image/Image.service";

const createPost = catchAsync(async (req: Request, res: Response) => {
  if (req.file) {
    console.log("file", req.file);
    const url = await imageService.createImage(req.file);
    req.body.thumbnail = url.imageUrl;
  }
  const result = await PostService.createPost(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Post created successfully",
    data: result,
  });
});
const getMyAllPost = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await PostService.getMyAllPost(userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "My all posts retrieved successfully",
    data: result,
  });
});
const feed = catchAsync(async (req: Request, res: Response) => {
  const result = await PostService.feed(req.query);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Feed retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});
const commentOnPost = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const result = await PostService.commentOnPost(postId, userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Comment successfully",
    data: result,
  });
});
const likeOnPost = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const result = await PostService.likeOnPost(postId, userId);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "like successfully",
    data: result,
  });
});

export const PostController = {
  createPost,
  getMyAllPost,
  feed,
  commentOnPost,
  likeOnPost,
};
