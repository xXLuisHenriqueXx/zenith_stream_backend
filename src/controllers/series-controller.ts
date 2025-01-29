import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../prisma';
import { cookieService } from '../services/cookieService';
import { createSeriesSchema, updateSeriesSchema } from '../schemas/seriesSchema';

export const seriesController = {
    async getAll(request: FastifyRequest, reply: FastifyReply) {
        try {
            const series = await prisma.series.findMany({
                include: { tags: true }
            });

            return reply.status(200).send({ success: true, series });

        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, message: "Internal server error" });
        }
    },

    async create(request: FastifyRequest, reply: FastifyReply, type: string) {
        const validation = createSeriesSchema.safeParse(request.body);
        if (!validation.success) {
            return reply.status(400).send({ success: false, message: validation.error.errors[0].message });
        }

        const cookie = request.cookies.token;
        const decodedCookie = cookieService.validateCookie(cookie as string);
        if (!cookie || !decodedCookie) {
            return reply.status(401).send({ success: false, message: "Invalid cookie" });
        }

        const isAdmin = decodedCookie.decoded.role === "ROLE_ADMIN";
        if (!isAdmin) {
            return reply.status(403).send({ success: false, message: "Forbidden" });
        }

        try {
            const { title, description, producer, ageRestriction, tags, releaseYear } = validation.data;

            await prisma.series.create({
                data: {
                    title,
                    description,
                    producer,
                    ageRestriction,
                    tags: {
                        connect: tags?.map((tag: any) => {
                            tags: tag.id
                        })
                    },
                    releaseYear,
                    type
                }
            });

            return reply.status(201).send({ success: true, message: "Series created" });

        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, message: "Internal server error" });
        }
    },

    async createSoapOpera(request: FastifyRequest, reply: FastifyReply) {
        await seriesController.create(request, reply, "SERIES_SOAP_OPERA");
    },

    async createTvShow(request: FastifyRequest, reply: FastifyReply) {
        await seriesController.create(request, reply, "SERIES_TV_SHOW");
    },

    async createAnime(request: FastifyRequest, reply: FastifyReply) {
        await seriesController.create(request, reply, "SERIES_ANIME");
    },

    async update(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        const validation = updateSeriesSchema.safeParse(request.body);
        if (!validation.success) {
            return reply.status(400).send({ success: false, message: validation.error.errors[0].message });
        }

        const cookie = request.cookies.token;
        const decodedCookie = cookieService.validateCookie(cookie as string);
        if (!cookie || !decodedCookie) {
            return reply.status(401).send({ success: false, message: "Invalid cookie" });
        }

        const isAdmin = decodedCookie.decoded.role === "ROLE_ADMIN";
        if (!isAdmin) {
            return reply.status(403).send({ success: false, message: "Forbidden" });
        }

        try {
            const { title, description, producer, ageRestriction, tags, releaseYear } = validation.data;

            await prisma.series.update({
                where: { id: request.params.id },
                data: {
                    title,
                    description,
                    producer,
                    ageRestriction,
                    tags: {
                        connect: tags?.map((tag: any) => {
                            tags: tag.id
                        })
                    },
                    releaseYear
                }
            });

            return reply.status(203).send({ success: true, message: "Series updated" });

        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, message: "Internal server error" });
        }
    },
    
    async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        const cookie = request.cookies.token;
        const decodedCookie = cookieService.validateCookie(cookie as string);
        if (!cookie || !decodedCookie) {
            return reply.status(401).send({ success: false, message: "Invalid cookie" });
        }

        const isAdmin = decodedCookie.decoded.role === "ROLE_ADMIN";
        if (!isAdmin) {
            return reply.status(403).send({ success: false, message: "Forbidden" });
        }

        try {
            await prisma.series.delete({ where: { id: request.params.id } });

            return reply.status(204).send({ success: true, message: "Series deleted" });

        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, message: "Internal server error" });
        }
    }
}