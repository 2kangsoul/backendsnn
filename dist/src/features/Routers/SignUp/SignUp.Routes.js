"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SignUp_Controller_1 = require("../../Controller/Signup/SignUp.Controller");
const router = (0, express_1.Router)();
const signUpController = new SignUp_Controller_1.SignUpController();
router.get("/data", signUpController.getNewSignUps);
exports.default = router;
//# sourceMappingURL=SignUp.Routes.js.map