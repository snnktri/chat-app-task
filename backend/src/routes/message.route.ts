import { Router } from "express";
import { verifyJWT } from "../middelwares/authMiddleware.js";
import { chageStatus, sendMessage } from "../controllers/message.controller.js";

const router = Router();


router.route("/send").post(verifyJWT, sendMessage);
router.route("/read/:id").patch(verifyJWT, chageStatus);

export default router