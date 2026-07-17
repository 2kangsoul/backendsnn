import { Router } from "express"
import { AuthControllers } from "./auth.controllers"
import rateLimit from "express-rate-limit"
import { AuthMiddleware } from "../../Middleware/authMiddleware"

const tryLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 3,
    message: "Too many login attempts, please try again later"
})

export const RouterAcoount = Router()
RouterAcoount.post('/register' , tryLimiter , AuthControllers.RegisterAccount)
RouterAcoount.post('/login' , tryLimiter , AuthControllers.LoginAccount)
RouterAcoount.post('/logout', AuthControllers.LogoutAccount)
RouterAcoount.get('/me',AuthMiddleware.authenticated, AuthControllers.Me)