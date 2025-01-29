import { fastify } from 'fastify';
import { fastifyCors } from "@fastify/cors";
import { validatorCompiler, serializerCompiler, ZodTypeProvider, jsonSchemaTransform } from "fastify-type-provider-zod";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import cookie from "@fastify/cookie";
import multipart from "@fastify/multipart";
import { routes } from './routes';
import path from 'path';
import fastifyStatic from '@fastify/static';

const port = process.env.PORT ? parseInt(process.env.PORT) : undefined;
const host = process.env.HOST;
const JWT_SECRET = process.env.JWT_KEY || 'secret';

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, { origin: '*' });
app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Pomodoro Backend',
            version: '1.0.0'
        }
    },
    transform: jsonSchemaTransform
});
app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
});

app.register(cookie, {
    secret: JWT_SECRET
});

app.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
});

app.register(multipart, {
    limits: {
        fileSize: 50 * 1024 * 1024
    }
});

app.register(routes, { prefix: '/api' });

app.listen({ port: port, host: host }).then(() => {
    console.log('Server is running on port 3000');
});