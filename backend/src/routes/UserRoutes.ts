import express from "express";
import UserController from "../controller/UserController";

const router = express.Router();


router.post("/create/new/user-register", UserController.RegisterCurrentUser);
router.post("/verify/new/user-login", UserController.LoginCurrentUser);
router.post("/notify/forgot-password", UserController.ForgetUserPassword);
router.post("/check/forgot-password/verify-otp", UserController.VerifyForgotPasswordOtp);
router.post("/update/forgot-password/new-password", UserController.ChangeNewUserPassword);
router.post("/notify/forgot-password/resend-otp", UserController.ResendForgotPasswordOtp);


export default router;