import { AppError } from "./App.error"
export class NotFoundError extends AppError {
    constructor(message: string) {
        super(404,message)
    }
}