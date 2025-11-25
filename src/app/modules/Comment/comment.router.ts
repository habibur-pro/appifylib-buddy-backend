import { Router } from "express";
import { CommentController } from "./comment.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/:id/replay", auth(), CommentController.replayOnPostComment);
router.post("/:id/like", auth(), CommentController.likeOnComment);
router.delete("/:id", auth(), CommentController.deleteComment);

export const CommentRouter = router;
