import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../prisma';
import { adminLoginSchema, adminRegisterSchema } from '../schemas/adminSchemas';
import { checkPassword, hashPassword } from '../utils/passwordUtils';
import { cookieService } from '../services/cookieService';

const ACCESS_KEY = process.env.ACCESS_KEY;

export const adminController = {
    async register(request: FastifyRequest, reply: FastifyReply) {
        const validation = adminRegisterSchema.safeParse(request.body);
        if (!validation.success) {
            return reply.status(400).send({ success: false, message: validation.error.errors[0].message });
        }

        const { username, password, email, accessKey } = validation.data;

        if (accessKey !== ACCESS_KEY) {
            return reply.status(401).send({ success: false, message: "Invalid access key" });
        }

        const existingAdmin = await prisma.user.findUnique({
            where: { email }
        });
        if (existingAdmin) {
            return reply.status(402).send({ success: false, message: "Email already exists" });
        }

        const hashedPassword = await hashPassword(password);

        try {
            await prisma.user.create({
                data: {
                    username,
                    password: hashedPassword,
                    email,
                    age: 40,
                    role: "ROLE_ADMIN",
                }
            });

            reply.setCookie('token', cookieService.createCookie(email, "ROLE_ADMIN"), { 
                path: '/',    
                httpOnly: true,
                 sameSite: 'lax',
            });

            return reply.status(201).send({ success: true, message: "Admin created successfully" });

        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, message: "Internal server error" });
        }
    },
    
    async login(request: FastifyRequest, reply: FastifyReply) {
        const validation = adminLoginSchema.safeParse(request.body);
        if (!validation.success) {
            return reply.status(400).send({ success: false, message: validation.error.errors[0].message });
        }

        try {
            const { email, password, accessKey } = validation.data;

            if (accessKey !== ACCESS_KEY) {
                return reply.status(401).send({ success: false, message: "Invalid access key" });
            }

            const admin = await prisma.user.findUnique({
                where: { email }
            });
            if (!admin) {
                return reply.status(404).send({ success: false, message: "Admin not found" });
            }

            const isValidPassword = await checkPassword(password, admin.password);
            if (!isValidPassword) {
                return reply.status(401).send({ success: false, message: "Invalid password" });
            }

            reply.cookie('token', cookieService.createCookie(admin.email, admin.role), { httpOnly: true });

            return reply.status(201).send({ success: true, message: "Admin logged in successfully" });

        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, message: "Internal server error" });
        }
    }
};