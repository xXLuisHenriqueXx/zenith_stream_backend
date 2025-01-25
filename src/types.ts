import { z } from "zod";
import { FastifyBaseLogger, FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

// import { userSchema } from "./schemas/userValidationSchemas";

// type User = z.infer<typeof userSchema>;

export type FastifyTypeInstance = FastifyInstance<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    FastifyBaseLogger,
    ZodTypeProvider
>;

declare module "fastify" {
    interface FastifyRequest {
        user?: any;
    }
};