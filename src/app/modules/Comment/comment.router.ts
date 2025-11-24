import { Router } from "express";
import { CommentController } from "./comment.controller";

const router = Router();

router.post("/:id/replay-comment", CommentController.replayOnPostComment);
router.post("/:id/like-comment", CommentController.likeOnComment);
router.delete("/:id", CommentController.deleteComment);

const CommentRouter = router;
