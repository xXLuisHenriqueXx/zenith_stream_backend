import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../prisma';
import { cookieService } from '../services/cookieService';
import { createSeriesSchema, updateSeriesSchema } from '../schemas/seriesSchema';
import path from 'path';

export const seriesController = {
    async getAll(request: FastifyRequest, reply: FastifyReply) {
        try {
            const tvShow = await prisma.series.findMany({
                where: { type: "SERIES_TV_SHOW" },
                include: { tags: true }
            });

            const soapOpera = await prisma.series.findMany({
                where: { type: "SERIES_SOAP_OPERA" },
                include: { tags: true }
            });

            const anime = await prisma.series.findMany({
                where: { type: "SERIES_ANIME" },
                include: { tags: true }
            });

            return reply.status(200).send({ success: true, tvShow, soapOpera, anime });

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
            const { title, description, producer, ageRestriction, tags, releaseYear, image } = validation.data;

            if (image) {
                const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
                require("fs").writeFile(`public/posters/series/${title}.png`, base64Data, "base64");
            }

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
                    type,
                    image: image ? `/posters/series/${title}.png` : null
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
            const { title, description, producer, ageRestriction, tags, releaseYear, image } = validation.data;

            if (image) {
                require("fs").unlink(path.join(__dirname, `../../public${image}`));

                const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
                require("fs").writeFile(`public/posters/series/${title}.png`, base64Data, "base64");
            }

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
                    releaseYear,
                    image: image ? `/posters/series/${title}.png` : null
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
            const series = await prisma.series.findUnique({ 
                where: { id: request.params.id } 
            });
            if (series.image) {
                require("fs").unlink(path.join(__dirname, `../../public${series.image}`));
            }

            await prisma.series.delete({ 
                where: { id: request.params.id } 
            });

            return reply.status(204).send({ success: true, message: "Series deleted" });

        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, message: "Internal server error" });
        }
    }
}