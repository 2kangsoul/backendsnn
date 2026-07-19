import z from "zod";
export class authValidation {
  static readonly REGISTER_ACCOUNT = z.object({
    body: z.object({
      email: z
        .string()
        .email("Please enter a valid email address.")
        .transform((email) => email.trim().toLocaleLowerCase()),
      username: z
        .string()
        .min(1, "Username is required")
        .min(5, "Username must be at least 5 characthers")
        .max(25, "Username must be at most 25 characthers"),
      fullName: z
        .string()
        .min(1, "Fullname is required")
        .min(5, "Fullname must be at least 5 characthers")
        .max(50, "Fullname must be at most 50 characthers"),
      password: z
        .string()
        .min(1, "Password is required.")
        .min(8, "Password must be at least 8 characters.")
        .max(20, "Password must be at most 20 characthers"),
      contact: z
        .string()
        .trim()
        .min(10, "Phone number at least must be at 10 digits")
        .max(20, "Phone number at least must be at 20 digits")
        .regex(/^\d+$/, "Phone number must contain only digits"),
    }),
  });
  static readonly LOGIN_ACCOUNT = z.object({
    body: z.object({
      email: z
        .string()
        .email("Please enter a valid email address.")
        .transform((email) => email.trim().toLocaleLowerCase()),
      password: z.string().min(1, "Password is required."),
    }),
  });
}
export type LoginAccountInput = z.infer<typeof authValidation.LOGIN_ACCOUNT>;
export type RegisterAccountInput = z.infer<
  typeof authValidation.REGISTER_ACCOUNT
>;
