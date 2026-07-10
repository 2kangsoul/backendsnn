import express, { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { authRouter } from "./features/Routers/Auth/auth.router";
import { userRouter } from "./features/Routers/user/User.Routes";
import { productRouter } from "./features/Routers/Product/Product.routers";
import { blogRouter } from "./features/Routers/Blog/Blog.Routers";
import { AnalyticRouter } from "./features/Routers/SiteAnalytics/analytic.router";
import subscriptionRouter from "./features/Routers/Subscription/Subscription.Routers";
import orderRouter from "./features/Routers/Order/Order.Routers";
import signUpRouter from "./features/Routers/SignUp/SignUp.Routes";
import expenseRouter from "./features/Routers/Expense/Expense.Routes";
import perfumeRouter from "./features/Routers/Perfume/Perfume.Routes";
import monthlyUsersRoute from "./features/Routers/MonthlyUsers/monthlyUsers.route";
import { verifyToken } from "./Middleware/verifyToken";
import { initWhatsApp } from "./config/whatsapp";
import waRouter from "./features/Routers/Whtasapp/Whatsapp.Routers";
import salesReportRouter from "../src/features/Routers/SalesReport/SalesReport.Routes";

import { transporter } from "./config/mailer";
import cors from "cors";
import path from "path";

const PORT: number = Number(process.env.PORT) || 8000;

const app = express();

app.use(
  cors({
    // ponytail: Next dev :3000 + Vite lama :5173. CORS_ORIGIN (comma-separated) menang di prod.
    origin: process.env.CORS_ORIGIN?.split(",") ?? [
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: "Hello, world!" });
});

app.use("/api/auth", authRouter);
app.use("/api/users", verifyToken, userRouter);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/products", productRouter);
app.use("/api/blogs", blogRouter);

const analyticRouter = new AnalyticRouter();
app.use("/api/analytics", analyticRouter.getRouter());
app.use("/api/subscriptions", subscriptionRouter);
app.use("/api/orders", orderRouter);
app.use("/api/signups", signUpRouter);
app.use("/api/expenses", expenseRouter);
app.use("/api/perfumes", perfumeRouter);
app.use("/api/monthly-users", monthlyUsersRoute);
app.use("/api/wa", waRouter);
app.use("/api/ai", salesReportRouter);

app.post(
  "/api/send-email",
  async (req: Request, res: Response): Promise<any> => {
    const { to, subject, bodyparts } = req.body;
    try {
      transporter
        .sendMail({
          from: `"Saa Fragrance" <${process.env.EMAIL_USER}>`,
          to: to,
          subject: subject,
          text: bodyparts?.textmessage,
          html: bodyparts?.htmlmessage,
        })
        .catch((err) => console.error("Email error:", err));
      return res.status(200).json({ message: "Email sedang dikirim!" });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Gagal mengirim email", error: error.message });
    }
  },
);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err?.message,
    data: null,
  });
});

app.get("/api/countries", async (req: Request, res: Response) => {
  try {
    const response = await fetch(
      "https://countriesnow.space/api/v0.1/countries/flag/unicode",
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Gagal fetch negara" });
  }
});

app.get("/api/provinces", async (req: Request, res: Response) => {
  const response = await fetch(
    "https://emsifa.github.io/api-wilayah-indonesia/api/provinces.json",
  );
  const data = await response.json();
  res.status(200).json(data);
});

app.get("/api/regencies/:id", async (req: Request, res: Response) => {
  const response = await fetch(
    `https://emsifa.github.io/api-wilayah-indonesia/api/regencies/${req.params.id}.json`,
  );
  const data = await response.json();
  res.status(200).json(data);
});

app.get("/api/districts/:id", async (req: Request, res: Response) => {
  const response = await fetch(
    `https://emsifa.github.io/api-wilayah-indonesia/api/districts/${req.params.id}.json`,
  );
  const data = await response.json();
  res.status(200).json(data);
});

app.get("/api/villages/:id", async (req: Request, res: Response) => {
  const response = await fetch(
    `https://emsifa.github.io/api-wilayah-indonesia/api/villages/${req.params.id}.json`,
  );
  const data = await response.json();
  res.status(200).json(data);
});

// ── Start server + WA Bot ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[⚡ APP] Application is running on port: ${PORT}`);
  initWhatsApp(); // ← init Baileys, QR muncul di terminal
});
