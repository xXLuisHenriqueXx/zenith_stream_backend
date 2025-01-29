import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../prisma';
import { cookieService } from '../services/cookieService';
import { createTagSchema, getContentByTagSchema, updateTagSchema } from '../schemas/tagSchema';

export const tagController = {
    async getAll(request: FastifyRequest, reply: FastifyReply) {
        try {
            const tags = await prisma.tag.findMany();
            return reply.status(200).send({ success: true, tags });

        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, message: "Internal server error" });
        }
    },

    async getContentByTag(request: FastifyRequest, reply: FastifyReply) {
        const validation = getContentByTagSchema.safeParse(request.query);
        if (!validation.success) {
            return reply.status(400).send({ success: false, message: validation.error.errors[0].message });
        }

        try {
            const { tagId, type } = validation.data;

            if (type === "TYPE_MOVIE") {
                const movies = await prisma.movie.findMany({
                    where: {
                        tags: {
                            some: {
                                id: {
                                    in: tagId
                                }
                            }
                        }
                    }
                });

                return reply.status(200).send({ success: true, content: movies });
            } 
            
            if (type === "TYPE_SERIES") {
                const series = await prisma.series.findMany({
                    where: {
                        tags: {
                            some: {
                                id: {
                                    in: tagId
                                }
                            }
                        }
                    }
                });

                return reply.status(200).send({ success: true, content: series });
            }

        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, message: "Internal server error" });
        }
    },

    async create(request: FastifyRequest, reply: FastifyReply) {
        const validation = createTagSchema.safeParse(request.body);
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
            const { name } = validation.data;

            await prisma.tag.create({
                data: {
                    name
                }
            });

            return reply.status(201).send({ success: true, message: "Tag created" });

        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, message: "Internal server error" });
        }
    },

    async update(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        const validation = updateTagSchema.safeParse(request.body);
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
            const { id } = request.params;
            const { name } = validation.data;

            await prisma.tag.update({
                where: { id },
                data: {
                    name
                }
            });

            return reply.status(203).send({ success: true, message: "Tag updated" });

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
            const { id } = request.params;

            await prisma.tag.delete({
                where: { id }
            });

            return reply.status(204).send({ success: true, message: "Tag deleted" });

        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, message: "Internal server error" });
        }
    }
};