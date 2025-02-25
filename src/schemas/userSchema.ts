import { z } from "zod";

export const userRegisterSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: "Username must to have at least 3 characteres" }),
  password: z
    .string()
    .min(8, { message: "Password must to have at least 8 characteres" }),
  email: z.string().email({ message: "Invalid email" }),
  age: z.number().int(),
});

export const userLoginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must to have at least 8 characteres" }),
});

export const watchContentSchema = z.object({
  contentId: z.string().uuid(),
  type: z.enum(["WATCHED_CONTENT_SERIES", "WATCHED_CONTENT_MOVIE"]),
});

export const watchLaterSchema = z.object({
  contentId: z.string().uuid(),
  type: z.enum(["WATCH_LATER_SERIES", "WATCH_LATER_MOVIE"]),
});

export const userSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  email: z.string().email(),
  age: z.number().int(),
  role: z.enum(["ROLE_USER", "ROLE_ADMIN"]),
  watchedContent: z.array(z.any()).optional(),
  watchLater: z.array(z.any()).optional(),
  createdAt: z.date(),
});
