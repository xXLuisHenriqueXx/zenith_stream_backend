import { z } from "zod";

export const createEpisodeSchema = z.object({
    title: z.string().min(3, { message: "Title must to have at least 3 characteres" }),
    description: z.string().min(3, { message: "Description must to have at least 3 characteres" }),
    durationInMinutes: z.number().min(1, { message: "Duration must to have at least 1 minute" }),
    season: z.number().min(1, { message: "Season must to have at least 1" }),
    episodeNumber: z.number().min(1, { message: "Episode must to have at least 1" }),
    image: z.any().nullable(),
});

export const updateEpisodeSchema = z.object({
    title: z.string().min(3, { message: "Title must to have at least 3 characteres" }).optional(),
    description: z.string().min(3, { message: "Description must to have at least 3 characteres" }).optional(),
    durationInMinutes: z.number().min(1, { message: "Duration must to have at least 1 minute" }).optional(),
    season: z.number().min(1, { message: "Season must to have at least 1" }).optional(),
    episodeNumber: z.number().min(1, { message: "Episode must to have at least 1" }).optional(),
    image: z.any().nullable(),
});

export const episodeSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string(),
    durationInMinutes: z.number(),
    season: z.number(),
    episodeNumber: z.number(),
    image: z.string().nullable(),
    createdAt: z.date(),
});