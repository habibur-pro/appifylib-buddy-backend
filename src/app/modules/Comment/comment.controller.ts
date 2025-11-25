import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { imageService } from "../Image/Image.service";
import { CommentService } from "./comment.service";

const replayOnPostComment = catchAsync(async (req: Request, res: Response) => {
  const commentId = req.params.id;
  const userId = req.user.id;
  console.log({ commentId, userId });
  const result = await CommentService.replayOnPostComment(
    commentId,
    userId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "comment reply sent successfully",
    data: result,
  });
});
const likeOnComment = catchAsync(async (req: Request, res: Response) => {
  const commentId = req.params.id;
  const userId = req.user.id;
  const result = await CommentService.LikeOnComment(commentId, userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Comment sent successfully",
    data: result,
  });
});
const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const commentId = req.params.id;
  const result = await CommentService.deleteComment(commentId);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Comment deleted successfully",
    data: result,
  });
});

export const CommentController = {
  replayOnPostComment,
  likeOnComment,
  deleteComment,
};
