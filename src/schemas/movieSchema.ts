import { z } from "zod";
import { tagSchema } from "./tagSchema";

export const createMovieSchema = z.object({
    title: z.string().min(3, { message: "Title must to have at least 3 characteres" }),
    description: z.string().min(3, { message: "Description must to have at least 3 characteres" }),
    director: z.string().min(3, { message: "Director must to have at least 3 characteres" }),
    durationInMinutes: z.number().min(1, { message: "Duration must to have at least 1 minute" }),
    ageRestriction: z.enum(["AGE_ALL", "AGE_10", "AGE_12", "AGE_14", "AGE_16", "AGE_18"]),
    tags: tagSchema.array().optional(),
    releaseYear: z.number().min(1900, { message: "Release year must to be greater than 1900" }),
    image: z.any().nullable(),
});

export const updateMovieSchema = z.object({
    title: z.string().min(3, { message: "Title must to have at least 3 characteres" }).optional(),
    description: z.string().min(3, { message: "Description must to have at least 3 characteres" }).optional(),
    director: z.string().min(3, { message: "Director must to have at least 3 characteres" }).optional(),
    durationInMinutes: z.number().min(1, { message: "Duration must to have at least 1 minute" }).optional(),
    ageRestriction: z.enum(["AGE_ALL", "AGE_10", "AGE_12", "AGE_14", "AGE_16", "AGE_18"]).optional(),
    tags: tagSchema.array().optional(),
    releaseYear: z.number().min(1900, { message: "Release year must to be greater than 1900" }).optional(),
    image: z.any().nullable(),
});

export const movieSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string(),
    director: z.string(),
    durationInMinutes: z.number(),
    ageRestriction: z.enum(["AGE_ALL", "AGE_10", "AGE_12", "AGE_14", "AGE_16", "AGE_18"]),
    tags: tagSchema.array().optional(),
    releaseYear: z.number(),
    image: z.string().nullable(),
    createdAt: z.date(),
});
