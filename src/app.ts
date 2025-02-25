import path from "node:path";
import cookie from "@fastify/cookie";
import { fastifyCors } from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { fastify } from "fastify";
import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

import { env } from "./env";
import { routes } from "./routes";

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: "http://localhost:5173",
  credentials: true,
});
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Pomodoro Backend",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});
app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.register(cookie, {
  secret: env.JWT_KEY,
});

app.register(fastifyStatic, {
  root: path.join(__dirname, "public"),
});

app.register(multipart, {
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

app.register(routes, { prefix: "/api" });

app.listen({ port: env.PORT, host: env.HOST }).then(() => {
  console.log("Server is running on port 3000");
});
