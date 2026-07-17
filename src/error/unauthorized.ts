import { AppError } from "./app.error";

export class UnAuthorizedError extends AppError {
    constructor(message: string) {
        super(401,message)
    }
}