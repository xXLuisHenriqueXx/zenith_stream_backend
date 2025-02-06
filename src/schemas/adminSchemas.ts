import { z } from "zod";

export const adminRegisterSchema = z.object({
    username: z.string().trim().min(3, { message: "Username must to have at least 3 characteres" }),
    password: z.string().min(8, { message: "Password must to have at least 8 characteres" }),
    email: z.string().email({ message: "Invalid email" }),
    accessKey: z.string().nonempty({ message: "Access key is required" }),
});

export const adminLoginSchema = z.object({
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(8, { message: "Password must to have at least 8 characteres" }),
    accessKey: z.string().nonempty({ message: "Access key is required" }),
});

export const adminSchema = z.object({
    id: z.string().uuid(),
    username: z.string(),
    email: z.string().email(),
    age: z.number().int(),
    role: z.enum(["ROLE_USER", "ROLE_ADMIN"]),
    watchedContent: z.array(z.any()).optional(),
    watchLater: z.array(z.any()).optional(),
    createdAt: z.date(),
});