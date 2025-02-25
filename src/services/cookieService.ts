import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

import { env } from "../env";

export const cookieService = {
  createCookie(email: string, role: string) {
    return jwt.sign({ email, role }, env.JWT_KEY, { expiresIn: "30d" });
  },

  validateCookie(token: string) {
    try {
      const decoded = jwt.verify(token, env.JWT_KEY) as {
        email: string;
        role: string;
      };
      return { decoded };
    } catch (error) {
      return null;
    }
  },

  async validateToken(request: FastifyRequest, reply: FastifyReply) {
    const token = request.cookies.token;
    if (!token) {
      reply.status(401).send({ success: false, message: "No cookie" });
      return;
    }

    try {
      const decodedCookie = cookieService.validateCookie(token);
      if (!decodedCookie) {
        reply.status(401).send({ success: false, message: "Invalid cookie" });
        return;
      }

      reply.status(200).send({
        success: true,
        message: "Valid cookie",
        role: decodedCookie.decoded.role,
      });
    } catch (error: unknown) {
      console.error(error);
      reply
        .status(500)
        .send({ success: false, message: "Internal server error" });
    }
  },

  async logout(request: FastifyRequest, reply: FastifyReply) {
    reply.clearCookie("token");
    reply.status(200).send({ success: true, message: "Logged out" });
  },
};
