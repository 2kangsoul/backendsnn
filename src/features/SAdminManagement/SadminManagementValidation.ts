import { z } from "zod";
export class AdminValidation {
  static readonly promoteAdminSchema = z.object({
    body: z.object({
      email: z
        .string()
        .min(1)
        .email()
        .transform((email) => email.toLocaleLowerCase().trim()),
    }),
  });
  static readonly demoteAdminSchmea = z.object({
    params: z.object({
      userId: z.string().uuid(),
    }),
  });
}
export type promoteAdminInput = z.infer<
  typeof AdminValidation.promoteAdminSchema
>;
export type demoteAdminInput = z.infer<
  typeof AdminValidation.demoteAdminSchmea
>;
