import fs from "node:fs";
import path from "node:path";
import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../prisma";

import {
  createEpisodeSchema,
  updateEpisodeSchema,
} from "../schemas/episodeSchema";
import { cookieService } from "../services/cookieService";

export const episodeController = {
  async create(
    request: FastifyRequest<{ Params: { seriesID: string } }>,
    reply: FastifyReply
  ) {
    const validation = createEpisodeSchema.safeParse(request.body);
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
        durationInMinutes,
        season,
        episodeNumber,
        image,
      } = validation.data;

      if (image) {
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        fs.writeFile(
          `public/posters/episode/${title}.png`,
          base64Data,
          "base64",
          err => {
            if (err) {
              console.error(err);
            }
          }
        );
      }

      await prisma.episode.create({
        data: {
          title,
          description,
          durationMinutes: durationInMinutes,
          season,
          episodeNumber,
          image: image
            ? `/posters/episode/${title}.png`
            : "https://placecats.com/neo/300/200",
          series: {
            connect: {
              id: request.params.seriesID,
            },
          },
        },
      });

      return reply
        .status(201)
        .send({ success: true, message: "Episode created" });
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
    const validation = updateEpisodeSchema.safeParse(request.body);
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
        durationInMinutes,
        season,
        episodeNumber,
        image,
      } = validation.data;

      if (image) {
        fs.unlinkSync(path.join(__dirname, `../../public${image}`));

        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        fs.writeFile(
          `public/posters/episode/${title}.png`,
          base64Data,
          "base64",
          err => {
            if (err) {
              console.error(err);
            }
          }
        );
      }

      await prisma.episode.update({
        where: {
          id: request.params.id,
        },
        data: {
          title,
          description,
          durationMinutes: durationInMinutes,
          season,
          episodeNumber,
          image: image
            ? `/posters/episode/${title}.png`
            : "https://placecats.com/neo/300/200",
        },
      });

      return reply
        .status(200)
        .send({ success: true, message: "Episode updated" });
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
      const episode = await prisma.episode.findUnique({
        where: {
          id: request.params.id,
        },
      });

      if (episode?.image) {
        fs.unlinkSync(path.join(__dirname, `../../public${episode.image}`));
      }

      await prisma.episode.delete({
        where: {
          id: request.params.id,
        },
      });

      return reply
        .status(200)
        .send({ success: true, message: "Episode deleted" });
    } catch (error: unknown) {
      console.error(error);
      return reply
        .status(500)
        .send({ success: false, message: "Internal server error" });
    }
  },
};
