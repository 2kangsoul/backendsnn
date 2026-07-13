import { AppError } from "./App.error"

export class UnAuthorizedError extends AppError {
    constructor(message: string) {
        super(401,message)
    }
}