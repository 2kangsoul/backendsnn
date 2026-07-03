"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
const auth_router_1 = require("./features/Routers/Auth/auth.router");
const User_Routes_1 = require("./features/Routers/user/User.Routes");
const Product_routers_1 = require("./features/Routers/Product/Product.routers");
const Blog_Routers_1 = require("./features/Routers/Blog/Blog.Routers");
const analytic_router_1 = require("./features/Routers/SiteAnalytics/analytic.router");
const Subscription_Routers_1 = __importDefault(require("./features/Routers/Subscription/Subscription.Routers"));
const Order_Routers_1 = __importDefault(require("./features/Routers/Order/Order.Routers"));
const SignUp_Routes_1 = __importDefault(require("./features/Routers/SignUp/SignUp.Routes"));
const Expense_Routes_1 = __importDefault(require("./features/Routers/Expense/Expense.Routes"));
const Perfume_Routes_1 = __importDefault(require("./features/Routers/Perfume/Perfume.Routes"));
const monthlyUsers_route_1 = __importDefault(require("./features/Routers/MonthlyUsers/monthlyUsers.route"));
const verifyToken_1 = require("./Middleware/verifyToken");
const Program_Routes_1 = __importDefault(require("./features/Routers/Program/Program.Routes"));
const Lecture_Routes_1 = __importDefault(require("./features/Routers/Lecture/Lecture.Routes"));
const Module_Routes_1 = __importDefault(require("./features/Routers/Module/Module.Routes"));
const student_routes_1 = __importDefault(require("./features/Routers/Student/student.routes"));
const whatsapp_1 = require("./config/whatsapp");
const attendance_bot_1 = require("./Services/attendance.bot");
const moduleSession_routes_1 = __importStar(require("./features/Routers/ModuleSession/moduleSession.routes"));
const Absensi_Routes_1 = __importDefault(require("./features/Routers/Absensi/Absensi.Routes"));
const Whatsapp_Routers_1 = __importDefault(require("./features/Routers/Whtasapp/Whatsapp.Routers"));
const exam_routes_1 = require("./features/Routers/Exam/exam.routes");
const ExamAI_Routes_1 = __importDefault(require("./features/Routers/Exam/ExamAI.Routes"));
const mailer_1 = require("./config/mailer");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const PORT = 8000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: "Hello, world!" });
});
app.use("/api/auth", auth_router_1.authRouter);
app.use("/api/users", verifyToken_1.verifyToken, User_Routes_1.userRouter);
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
app.use("/api/products", Product_routers_1.productRouter);
app.use("/api/blogs", Blog_Routers_1.blogRouter);
const analyticRouter = new analytic_router_1.AnalyticRouter();
app.use("/api/analytics", analyticRouter.getRouter());
app.use("/api/subscriptions", Subscription_Routers_1.default);
app.use("/api/orders", Order_Routers_1.default);
app.use("/api/signups", SignUp_Routes_1.default);
app.use("/api/expenses", Expense_Routes_1.default);
app.use("/api/perfumes", Perfume_Routes_1.default);
app.use("/api/monthly-users", monthlyUsers_route_1.default);
app.use("/api/programs", Program_Routes_1.default);
app.use("/api/lectures", Lecture_Routes_1.default);
app.use("/api/students", student_routes_1.default);
app.use("/api/modules", Module_Routes_1.default);
app.use("/api/modules", moduleSession_routes_1.default);
app.use("/api/sessions", moduleSession_routes_1.sessionRouter);
app.use("/api/lectures", Absensi_Routes_1.default);
app.use("/api/wa", Whatsapp_Routers_1.default);
app.use("/api/modules", exam_routes_1.moduleExamRouter);
app.use("/api/exams", exam_routes_1.examRouter);
app.use("/api/questions", exam_routes_1.questionRouter);
app.use("/api/submissions", exam_routes_1.submissionRouter);
app.use("/api/exams", ExamAI_Routes_1.default);
app.post("/api/send-email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { to, subject, bodyparts } = req.body;
    try {
        mailer_1.transporter
            .sendMail({
            from: `"Saa Fragrance" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            text: bodyparts === null || bodyparts === void 0 ? void 0 : bodyparts.textmessage,
            html: bodyparts === null || bodyparts === void 0 ? void 0 : bodyparts.htmlmessage,
        })
            .catch((err) => console.error("Email error:", err));
        return res.status(200).json({ message: "Email sedang dikirim!" });
    }
    catch (error) {
        return res.status(500).json({ message: "Gagal mengirim email", error: error.message });
    }
}));
app.use((err, req, res, next) => {
    return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err === null || err === void 0 ? void 0 : err.message,
        data: null,
    });
});
app.get("/api/countries", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch("https://countriesnow.space/api/v0.1/countries/flag/unicode");
        const data = yield response.json();
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({ message: "Gagal fetch negara" });
    }
}));
app.get("/api/provinces", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch("https://emsifa.github.io/api-wilayah-indonesia/api/provinces.json");
    const data = yield response.json();
    res.status(200).json(data);
}));
app.get("/api/regencies/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`https://emsifa.github.io/api-wilayah-indonesia/api/regencies/${req.params.id}.json`);
    const data = yield response.json();
    res.status(200).json(data);
}));
app.get("/api/districts/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`https://emsifa.github.io/api-wilayah-indonesia/api/districts/${req.params.id}.json`);
    const data = yield response.json();
    res.status(200).json(data);
}));
app.get("/api/villages/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`https://emsifa.github.io/api-wilayah-indonesia/api/villages/${req.params.id}.json`);
    const data = yield response.json();
    res.status(200).json(data);
}));
// ── Start server + WA Bot ─────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`[⚡ APP] Application is running on port: ${PORT}`);
    (0, whatsapp_1.initWhatsApp)(); // ← init Baileys, QR muncul di terminal
    (0, attendance_bot_1.startAttendanceBot)(); // ← start cron absensi
});
//# sourceMappingURL=App.js.map