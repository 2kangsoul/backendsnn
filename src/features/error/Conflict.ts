import { AppError } from "./App.error";
export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message);
  }
}
