import {Router} from "express";
import { createThread, getThreads, updateThread } from "../controllers/thread.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { populateUser } from "../middleware/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);

router.post("/create", populateUser, createThread);
router.get("/", getThreads);
router.put("/:id", populateUser, updateThread);

export default router;