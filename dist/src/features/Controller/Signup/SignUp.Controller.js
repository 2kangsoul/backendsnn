"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpController = void 0;
const SignUp_Services_1 = require("../../Services/Signup/SignUp.Services");
class SignUpController {
    constructor() {
        this.signUpService = new SignUp_Services_1.SignUpService();
        this.getNewSignUps = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.signUpService.getNewSignUpsData();
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                console.error("Error getNewSignUps:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
}
exports.SignUpController = SignUpController;
//# sourceMappingURL=SignUp.Controller.js.map