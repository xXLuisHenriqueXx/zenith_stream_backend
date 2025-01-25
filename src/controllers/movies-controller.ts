import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../prisma';
import { checkPassword, hashPassword } from '../utils/passwordUtils';
import { cookieService } from '../services/cookieService';
import { createMovieSchema, updateMovieSchema } from '../schemas/movieSchema';

export const moviesController = {
    async getAll(request: FastifyRequest, reply: FastifyReply) {
        try {
            const movies = await prisma.movie.findMany({
                include: { tags: true }
            });

            return reply.status(200).send({ success: true, movies });

        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, message: "Internal server error" });
        }
    },

    async create(request: FastifyRequest, reply: FastifyReply) {
        const validation = createMovieSchema.safeParse(request.body);
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
            const { title, description, director, durationInMinutes, ageRestriction, tags, releaseYear } = validation.data;

            await prisma.movie.create({
                data: {
                    title,
                    description,
                    director,
                    durationInMinutes,
                    ageRestriction,
                    tags: {
                        connect: tags?.map((tag : any) => {
                            tags: tag.id
                        })
                    },
                    releaseYear
                }
            });

            return reply.status(201).send({ success: true, message: "Movie created" });
        
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, message: "Internal server error" });
        }
    },

    async update(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        const validation = updateMovieSchema.safeParse(request.body);
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
            const { title, description, director, durationInMinutes, ageRestriction, tags, releaseYear } = validation.data;

            await prisma.movie.update({
                where: { id: request.params.id },
                data: {
                    title,
                    description,
                    director,
                    durationInMinutes,
                    ageRestriction,
                    tags: {
                        connect: tags?.map((tag : any) => {
                            tags: tag.id
                        })
                    },
                    releaseYear
                }
            });

            return reply.status(203).send({ success: true, message: "Movie updated" });
        
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
            await prisma.movie.delete({
                where: { id: request.params.id }
            });

            return reply.status(204).send({ success: true, message: "Movie deleted" });
        
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, message: "Internal server error" });
        }
    },
}