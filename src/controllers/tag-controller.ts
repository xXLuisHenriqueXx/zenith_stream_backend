import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../prisma";

import {
  createTagSchema,
  getContentByTagSchema,
  updateTagSchema,
} from "../schemas/tagSchema";
import { cookieService } from "../services/cookieService";

export const tagController = {
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const tags = await prisma.tags.findMany();
      return reply.status(200).send({ success: true, tags });
    } catch (error: unknown) {
      console.error(error);
      return reply
        .status(500)
        .send({ success: false, message: "Internal server error" });
    }
  },

  async getContentByTag(request: FastifyRequest, reply: FastifyReply) {
    const validation = getContentByTagSchema.safeParse(request.query);
    if (!validation.success) {
      return reply
        .status(400)
        .send({ success: false, message: validation.error.errors[0].message });
    }

    try {
      const { tagId, type } = validation.data;

      if (type === "TYPE_MOVIE") {
        const movies = await prisma.movie.findMany({
          where: {
            tags: {
              some: {
                id: {
                  in: tagId,
                },
              },
            },
          },
        });

        return reply.status(200).send({ success: true, content: movies });
      }

      if (type === "TYPE_SERIES") {
        const series = await prisma.series.findMany({
          where: {
            tags: {
              some: {
                id: {
                  in: tagId,
                },
              },
            },
          },
        });

        return reply.status(200).send({ success: true, content: series });
      }
    } catch (error: unknown) {
      console.error(error);
      return reply
        .status(500)
        .send({ success: false, message: "Internal server error" });
    }
  },

  async create(request: FastifyRequest, reply: FastifyReply) {
    const validation = createTagSchema.safeParse(request.body);
    if (!validation.success) {
      return reply
        .status(400)
        .send({ success: false, message: validation.error.errors[0].message });
    }

    const cookie = request.cookies.token;
    const decodedCookie = cookieService.validateCookie(cookie as string);
    if (!cookie || !decodedCookie) {
      return reply
        .status(401)
        .send({ success: false, message: "Invalid cookie" });
    }

    const isAdmin = decodedCookie.decoded.role === "ROLE_ADMIN";
    if (!isAdmin) {
      return reply.status(403).send({ success: false, message: "Forbidden" });
    }

    try {
      const { name } = validation.data;

      await prisma.tags.create({
        data: {
          name,
        },
      });

      return reply.status(201).send({ success: true, message: "Tag created" });
    } catch (error: unknown) {
      console.error(error);
      return reply
        .status(500)
        .send({ success: false, message: "Internal server error" });
    }
  },

  async update(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const validation = updateTagSchema.safeParse(request.body);
    if (!validation.success) {
      return reply
        .status(400)
        .send({ success: false, message: validation.error.errors[0].message });
    }

    const cookie = request.cookies.token;
    const decodedCookie = cookieService.validateCookie(cookie as string);
    if (!cookie || !decodedCookie) {
      return reply
        .status(401)
        .send({ success: false, message: "Invalid cookie" });
    }

    const isAdmin = decodedCookie.decoded.role === "ROLE_ADMIN";
    if (!isAdmin) {
      return reply.status(403).send({ success: false, message: "Forbidden" });
    }

    try {
      const { id } = request.params;
      const { name } = validation.data;

      await prisma.tags.update({
        where: { id },
        data: {
          name,
        },
      });

      return reply.status(203).send({ success: true, message: "Tag updated" });
    } catch (error: unknown) {
      console.error(error);
      return reply
        .status(500)
        .send({ success: false, message: "Internal server error" });
    }
  },

  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const cookie = request.cookies.token;
    const decodedCookie = cookieService.validateCookie(cookie as string);
    if (!cookie || !decodedCookie) {
      return reply
        .status(401)
        .send({ success: false, message: "Invalid cookie" });
    }

    const isAdmin = decodedCookie.decoded.role === "ROLE_ADMIN";
    if (!isAdmin) {
      return reply.status(403).send({ success: false, message: "Forbidden" });
    }

    try {
      const { id } = request.params;

      await prisma.tags.delete({
        where: { id },
      });

      return reply.status(204).send({ success: true, message: "Tag deleted" });
    } catch (error: unknown) {
      console.error(error);
      return reply
        .status(500)
        .send({ success: false, message: "Internal server error" });
    }
  },
};
