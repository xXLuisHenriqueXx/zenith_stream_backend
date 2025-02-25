import { z } from "zod";

export const createTagSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must to have at least 3 characteres" }),
});

export const updateTagSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must to have at least 3 characteres" })
    .optional(),
});

export const getContentByTagSchema = z.object({
  tagId: z.string().uuid().array(),
  type: z.enum(["TYPE_MOVIE", "TYPE_SERIES"]),
});

export const tagSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.date(),
});
