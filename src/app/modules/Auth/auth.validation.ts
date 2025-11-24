import { z } from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});
const registerValidationSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
});

export const authValidation = {
  registerValidationSchema,
  loginValidationSchema,
};
