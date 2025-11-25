import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";

const replayOnPostComment = async (
  commentId: string,
  userId: string,
  payload: { comment: string; parentCommentId: string }
) => {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, "comment not found!");
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found!");
  }
  console.log({ comment, user });
  const parentComment = await prisma.comment.findUnique({
    where: { id: commentId },
  });
  if (!parentComment) {
    throw new ApiError(httpStatus.NOT_FOUND, "parent comment not found!");
  }

  const newComment = await prisma.comment.create({
    data: {
      parentId: parentComment.id,
      userId: userId,
      comment: payload.comment,
      postId: parentComment.postId as string,
    },
  });

  return { message: "comment created" };
};

const deleteComment = async (commentId: string) => {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, "comment not found!");
  }
  await prisma.comment.delete({ where: { id: commentId } });
  return null;
};

const LikeOnComment = async (commentId: string, userId: string) => {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, "comment not found!");
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found!");
  }
  const like = await prisma.like.findFirst({ where: { commentId, userId } });
  if (like) {
    await prisma.like.delete({ where: { id: like.id } });
  } else {
    await prisma.like.create({ data: { userId, commentId } });
  }
  return { message: "like success" };
};

export const CommentService = {
  replayOnPostComment,
  deleteComment,
  LikeOnComment,
};
