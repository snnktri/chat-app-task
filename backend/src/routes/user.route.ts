
//import { app } from "../app.js";
import { Router } from "express";
import { registerUser, loginUser, logoutUser, protectedUser, getAllUser, userById } from "../controllers/user.controller.js";
import { upload } from "../middelwares/multerMiddleware.js";
import { verifyJWT } from "../middelwares/authMiddleware.js";


const router = Router();
console.log("Here i am.");
router.route("/register").post(upload.single(
   "profile"
), registerUser);

router.route("/login").post(loginUser);
router.route("/logout").get(verifyJWT, logoutUser);

router.route("/protected").get(verifyJWT, protectedUser);

router.route("/getAll").get(verifyJWT, getAllUser);
router.route("/byId/:id").get(verifyJWT, userById);


export default router;