import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../prisma';
import { userLoginSchema, userRegisterSchema, watchContentSchema, watchLaterSchema } from '../schemas/userSchema';
import { checkPassword, hashPassword } from '../utils/passwordUtils';
import { cookieService } from '../services/cookieService';

export const userController = {
    async register(request: FastifyRequest, reply: FastifyReply) {
        const validation = userRegisterSchema.safeParse(request.body);
        if (!validation.success) {
            return reply.status(400).send({ success: false, message: validation.error.errors[0].message });
        }

        const { username, password, email, age } = validation.data;

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return reply.status(402).send({ success: false, message: "Email already exists" });
        }

        const hashedPassword = await hashPassword(password);

        try {
            await prisma.user.create({
                data: {
                    username,
                    password: hashedPassword,
                    email,
                    age,
                    role: "ROLE_USER",
                }
            });

            return reply.status(201).send({ success: true, message: "User created successfully" });

        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, message: "Internal server error" });
        }
    },

    async login(request: FastifyRequest, reply: FastifyReply) {
        const validation = userLoginSchema.safeParse(request.body);
        if (!validation.success) {
            return reply.status(400).send({ success: false, message: validation.error.errors[0].message });
        }

        try {
            const { email, password } = validation.data;

            const user = await prisma.user.findUnique({
                where: { email }
            });
            if (!user) {
                return reply.status(404).send({ success: false, message: "User not found" });
            }

            const passwordMatch = await checkPassword(password, user.password);
            if (!passwordMatch) {
                return reply.status(401).send({ success: false, message: "Invalid password" });
            }
            ;
            reply.setCookie('token', cookieService.createCookie(email, user.role), { httpOnly: true });

            return reply.status(200).send({ success: true, message: "Logged in" });

        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, message: "Internal server error" });
        }
    },

    async watchContent(request: FastifyRequest, reply: FastifyReply) {
        const validation = watchContentSchema.safeParse(request.body);
        if (!validation.success) {
            return reply.status(400).send({ success: false, message: validation.error.errors[0].message });
        }

        const cookie = request.cookies.token;
        const decodedCookie = cookieService.validateCookie(cookie as string);
        if (!cookie || !decodedCookie) {
            return reply.status(401).send({ success: false, message: "Invalid cookie" });
        }

        try {
            const { contentId, type } = validation.data;

            const user = await prisma.user.findUnique({
                where: { email: decodedCookie.decoded.email }
            });
            if (!user) {
                return reply.status(404).send({ success: false, message: "User not found" });
            }

            if (type === "WATCHED_CONTENT_SERIES") {
                await prisma.user.update({
                    where: { email: decodedCookie.decoded.email },
                    data: {
                        watchedContent: {
                            create: {
                                type: "WATCHED_CONTENT_SERIES",
                                series: {
                                    connect: {
                                        id: contentId
                                    }
                                }
                            }
                        }
                    }
                })
            }

            if (type === "WATCHED_CONTENT_MOVIE") {
                await prisma.user.update({
                    where: { email: decodedCookie.decoded.email },
                    data: {
                        watchContent: {
                            create: {
                                type: "WATCHED_CONTENT_MOVIE",
                                movie: {
                                    connect: {
                                        id: contentId
                                    }
                                }
                            }
                        }
                    }
                })
            }

            return reply.status(203).send({ success: true, message: "Content watched" });

        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, message: "Internal server error" });
        }
    },

    async watchLater(request: FastifyRequest, reply: FastifyReply) {
        const validation = watchLaterSchema.safeParse(request.body);
        if (!validation.success) {
            return reply.status(400).send({ success: false, message: validation.error.errors[0].message });
        }

        const cookie = request.cookies.token;
        const decodedCookie = cookieService.validateCookie(cookie as string);
        if (!cookie || !decodedCookie) {
            return reply.status(401).send({ success: false, message: "Invalid cookie" });
        }

        try {
            const { contentId, type } = validation.data;

            const user = await prisma.user.findUnique({
                where: { email: decodedCookie.decoded.email }
            });
            if (!user) {
                return reply.status(404).send({ success: false, message: "User not found" });
            }

            if (type === "WATCH_LATER_SERIES") {
                await prisma.user.update({
                    where: { email: decodedCookie.decoded.email },
                    data: {
                        watchLater: {
                            create: {
                                type: "WATCH_LATER_SERIES",
                                series: {
                                    connect: {
                                        id: contentId
                                    }
                                }
                            }
                        }
                    }
                })
            } 
            if (type === "WATCH_LATER_MOVIE") {
                await prisma.user.update({
                    where: { email: decodedCookie.decoded.email },
                    data: {
                        watchLater: {
                            create: {
                                type: "WATCH_LATER_MOVIE",
                                movie: {
                                    connect: {
                                        id: contentId
                                    }
                                }
                            }
                        }
                    }
                })
            }

            return reply.status(203).send({ success: true, message: "Content added to watch later" });

        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, message: "Internal server error" });
        }
    }
}