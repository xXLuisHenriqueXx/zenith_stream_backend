import jwt from 'jsonwebtoken';
import { FastifyReply, FastifyRequest } from 'fastify';

const JWT_SECRET = process.env.JWT_KEY || 'secret';

export const cookieService = {
    createCookie(email: string, role: string) {
        return jwt.sign({ email, role }, JWT_SECRET, { expiresIn: '30d' });
    },

    validateCookie(token: string) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { email: string, role: string };
            return { decoded };

        } catch (error) {
            return null;
        }
    },

    async validateToken(request: FastifyRequest, reply: FastifyReply) {
        const token = request.cookies?.token;
        if (!token) {
            reply.status(401).send({ success: false, message: 'No cookie' });
            return;
        }

        const decodedCookie = this.validateCookie(token);
        if (!decodedCookie) {
            reply.status(401).send({ success: false, message: 'Invalid cookie' });
            return;
        }

        reply.status(200).send({ success: true, message: 'Valid cookie', role: decodedCookie.decoded.role });
    },

    async logout(request: FastifyRequest, reply: FastifyReply) {
        reply.clearCookie('token')
        reply.status(200).send({ success: true, message: 'Logged out' });
    }
}