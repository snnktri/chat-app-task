import { Router } from "express";
import { verifyJWT } from "../middelwares/authMiddleware.js";
import { createChat, getAllChat, getChatById } from "../controllers/chat.controller.js";

const router = Router();


router.route("/create").post(verifyJWT, createChat);
router.route("/getAll").get(verifyJWT, getAllChat);
router.route("/getOne/:id").get(verifyJWT, getChatById);

export default router