import { z } from 'zod';

export const LoginResponseSchema = z.object({
  token: z.string().min(1),
});

export const LoginErrorResponseSchema = z.object({
  error: z.string().min(1),
});

export const OAuth2TokenResponseSchema = z.object({
  access_token: z.string().min(1),
  token_type: z.string().default('Bearer'),
  expires_in: z.number().optional(),
  scope: z.string().optional(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type LoginErrorResponse = z.infer<typeof LoginErrorResponseSchema>;
export type OAuth2TokenResponse = z.infer<typeof OAuth2TokenResponseSchema>;
