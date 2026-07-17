import { AppError } from "./app.error";

export class Forbidden extends AppError {
  constructor(message: string) {
    super(403, message);
  }
}
