import { AppError } from "./App.error"
export class BadRequestError extends AppError {
    constructor(message: string) {
        super(400,message)
    }
}