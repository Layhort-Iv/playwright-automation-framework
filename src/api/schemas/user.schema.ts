import { z } from 'zod';

export const UserItemSchema = z.object({
  id: z.union([z.number(), z.string()]),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  avatar: z.string().url().optional(),
});

export const UserListResponseSchema = z.object({
  page: z.number(),
  per_page: z.number(),
  total: z.number(),
  total_pages: z.number(),
  data: z.array(UserItemSchema),
  support: z
    .object({
      url: z.string().url(),
      text: z.string(),
    })
    .optional(),
});

export const SingleUserResponseSchema = z.object({
  data: UserItemSchema,
  support: z
    .object({
      url: z.string().url(),
      text: z.string(),
    })
    .optional(),
});

export const CreateUserRequestSchema = z.object({
  name: z.string().min(1),
  job: z.string().min(1),
});

export const CreateUserResponseSchema = z.object({
  name: z.string(),
  job: z.string(),
  id: z.string(),
  createdAt: z.string(),
});

export const UpdateUserResponseSchema = z.object({
  name: z.string(),
  job: z.string(),
  updatedAt: z.string(),
});

export type UserItem = z.infer<typeof UserItemSchema>;
export type UserListResponse = z.infer<typeof UserListResponseSchema>;
export type SingleUserResponse = z.infer<typeof SingleUserResponseSchema>;
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;
export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>;
export type UpdateUserResponse = z.infer<typeof UpdateUserResponseSchema>;
