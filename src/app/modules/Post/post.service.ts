import { Post } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import QueryBuilder from "../../../helpars/queryBuilder";

const createPost = async (payload: Post) => {
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found!");
  }
  await prisma.post.create({
    data: {
      userId: payload.userId,
      text: payload.text,
      thumbnail: payload.thumbnail,
      visibility: payload.visibility,
    },
  });
  return { message: "new post created successfully" };
};
const getMyAllPost = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { likes: true },
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found!");
  }

  return await prisma.post.findMany({ where: { userId: userId } });
};

const feed = async (queryParams: Record<string, any>) => {
  try {
    const queryBuilder = new QueryBuilder(prisma.post, queryParams);

    const patients = await queryBuilder
      .search(["firstName", "lastName", "email"])
      .filter()
      .sort()
      .include({
        likes: true,
        comments: {
          include: {
            replies: {
              include: { likes: true },
            },
            likes: {
              select: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    photo: true,
                  },
                },
              },
            },
          },
        },
      })
      .paginate()
      .execute();

    const meta = await queryBuilder.countTotal();
    return { data: patients, meta };
  } catch (error) {
    console.log("error", error);
    return {
      meta: { page: 1, limit: 10, total: 0, totalPage: 0 },
      data: [],
    };
  }
};

const likeOnPost = async (postId: string, userId: string) => {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found!");
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found!");
  }
  console.log({ post, user });
  const like = await prisma.like.findFirst({ where: { postId, userId } });
  if (like) {
    await prisma.like.delete({ where: { id: like.id } });
  } else {
    await prisma.like.create({ data: { postId, userId } });
  }
  return { message: "like success" };
};

const commentOnPost = async (
  postId: string,
  userId: string,
  payload: { comment: string }
) => {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found!");
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found!");
  }

  await prisma.comment.create({
    data: { postId, userId, comment: payload.comment },
  });

  return { message: "comment success" };
};

export const PostService = {
  feed,
  createPost,
  getMyAllPost,
  commentOnPost,
  likeOnPost,
};
