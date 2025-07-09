import { Router } from "express";
import { createComment, getCommentsByThread, updateComment, deleteComment } from "../controllers/comment.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { populateUser } from "../middleware/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);

router.post("/create", populateUser, createComment);
router.get("/:threadId", getCommentsByThread);
router.put("/:id", populateUser, updateComment);
router.delete("/:id", deleteComment);

export default router;