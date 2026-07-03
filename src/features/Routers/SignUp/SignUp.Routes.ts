import { Router } from "express";
import { SignUpController } from "../../Controller/Signup/SignUp.Controller";

const router = Router();
const signUpController = new SignUpController();

router.get("/data", signUpController.getNewSignUps);

export default router;