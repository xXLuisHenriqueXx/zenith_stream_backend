import fs from "node:fs";
import path from "node:path";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { z } from "zod";
import { prisma } from "../prisma";

import {
  createSeriesSchema,
  updateSeriesSchema,
} from "../schemas/seriesSchema";
import type { tagSchema } from "../schemas/tagSchema";
import { cookieService } from "../services/cookieService";

type Tag = z.infer<typeof tagSchema>;
type SeriesType = "SERIES_TV_SHOW" | "SERIES_SOAP_OPERA" | "SERIES_ANIME";

export const seriesController = {
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const tvShow = await prisma.series.findMany({
        where: { type: "SERIES_TV_SHOW" },
        include: { tags: true, episodes: true },
      });

      const soapOpera = await prisma.series.findMany({
        where: { type: "SERIES_SOAP_OPERA" },
        include: { tags: true, episodes: true },
      });

      const anime = await prisma.series.findMany({
        where: { type: "SERIES_ANIME" },
        include: { tags: true, episodes: true },
      });

      return reply
        .status(200)
        .send({ success: true, tvShow, soapOpera, anime });
    } catch (error: unknown) {
      console.error(error);
      return reply
        .status(500)
        .send({ success: false, message: "Internal server error" });
    }
  },

  async create(request: FastifyRequest, reply: FastifyReply, type: SeriesType) {
    const validation = createSeriesSchema.safeParse(request.body);
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
      const {
        title,
        description,
        producer,
        ageRestriction,
        tags,
        releaseYear,
        image,
      } = validation.data;

      if (image) {
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        fs.writeFile(
          `public/posters/series/${title}.png`,
          base64Data,
          "base64",
          err => {
            if (err) {
              console.error(err);
            }
          }
        );
      }

      await prisma.series.create({
        data: {
          title,
          description,
          producer,
          ageRestriction,
          tags: {
            connect: tags?.map((tag: Tag) => ({
              id: tag.id,
            })),
          },
          releaseYear,
          type,
          image: image
            ? `/posters/series/${title}.png`
            : "https://placecats.com/neo/300/200",
        },
      });

      return reply
        .status(201)
        .send({ success: true, message: "Series created" });
    } catch (error: unknown) {
      console.error(error);
      return reply
        .status(500)
        .send({ success: false, message: "Internal server error" });
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

  async update(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const validation = updateSeriesSchema.safeParse(request.body);
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
      const {
        title,
        description,
        producer,
        ageRestriction,
        tags,
        releaseYear,
        image,
      } = validation.data;

      if (image) {
        fs.unlinkSync(path.join(__dirname, `../../public${image}`));

        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        fs.writeFile(
          `public/posters/series/${title}.png`,
          base64Data,
          "base64",
          err => {
            if (err) {
              console.error(err);
            }
          }
        );
      }

      await prisma.series.update({
        where: { id: request.params.id },
        data: {
          title,
          description,
          producer,
          ageRestriction,
          tags: {
            connect: tags?.map((tag: Tag) => ({
              id: tag.id,
            })),
          },
          releaseYear,
          image: image
            ? `/posters/series/${title}.png`
            : "https://placecats.com/neo/300/200",
        },
      });

      return reply
        .status(203)
        .send({ success: true, message: "Series updated" });
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
      const series = await prisma.series.findUnique({
        where: { id: request.params.id },
      });
      if (series?.image) {
        fs.unlinkSync(path.join(__dirname, `../../public${series.image}`));
      }

      await prisma.series.delete({
        where: { id: request.params.id },
      });

      return reply
        .status(204)
        .send({ success: true, message: "Series deleted" });
    } catch (error: unknown) {
      console.error(error);
      return reply
        .status(500)
        .send({ success: false, message: "Internal server error" });
    }
  },
};
