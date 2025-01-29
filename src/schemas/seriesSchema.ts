import { z } from "zod";
import { tagSchema } from "./tagSchema";

export const createSeriesSchema = z.object({
    title: z.string().min(3, { message: "Title must to have at least 3 characteres" }),
    description: z.string().min(3, { message: "Description must to have at least 3 characteres" }),
    producer: z.string().min(3, { message: "Director must to have at least 3 characteres" }),
    ageRestriction: z.enum(["AGE_ALL", "AGE_10", "AGE_12", "AGE_14", "AGE_16", "AGE_18"]),
    releaseYear: z.number().min(1900, { message: "Release year must to be greater than 1900" }),
    type: z.enum(["SERIES_SOAP_OPERA", "SERIES_TV_SHOW", "SERIES_ANIME"]),
    tags: z.array(z.any()).optional(),
});

export const updateSeriesSchema = z.object({
    title: z.string().min(3, { message: "Title must to have at least 3 characteres" }),
    description: z.string().min(3, { message: "Description must to have at least 3 characteres" }),
    producer: z.string().min(3, { message: "Director must to have at least 3 characteres" }),
    ageRestriction: z.enum(["AGE_ALL", "AGE_10", "AGE_12", "AGE_14", "AGE_16", "AGE_18"]),
    releaseYear: z.number().min(1900, { message: "Release year must to be greater than 1900" }),
    type: z.enum(["SERIES_SOAP_OPERA", "SERIES_TV_SHOW", "SERIES_ANIME"]),
    tags: z.array(z.any()).optional(),
});

export const seriesSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string(),
    producer: z.string(),
    ageRestriction: z.enum(["AGE_ALL", "AGE_10", "AGE_12", "AGE_14", "AGE_16", "AGE_18"]),
    releaseYear: z.number(),
    type: z.enum(["SERIES_SOAP_OPERA", "SERIES_TV_SHOW", "SERIES_ANIME"]),
    episodes: z.any().array().optional(),
    tags: tagSchema.array().optional(),
    createdAt: z.date(),
});
