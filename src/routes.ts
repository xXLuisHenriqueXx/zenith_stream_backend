import { z } from "zod";

import type { FastifyTypeInstance } from "./types";

import { adminController } from "./controllers/admin-controller";
import { episodeController } from "./controllers/episodes-controller";
import { moviesController } from "./controllers/movies-controller";
import { seriesController } from "./controllers/series-controller";
import { tagController } from "./controllers/tag-controller";
import { userController } from "./controllers/user-controller";
import { cookieService } from "./services/cookieService";

import { adminLoginSchema, adminRegisterSchema } from "./schemas/adminSchemas";
import {
  createEpisodeSchema,
  updateEpisodeSchema,
} from "./schemas/episodeSchema";
import {
  createMovieSchema,
  movieSchema,
  updateMovieSchema,
} from "./schemas/movieSchema";
import {
  createSeriesSchema,
  seriesSchema,
  updateSeriesSchema,
} from "./schemas/seriesSchema";
import {
  createTagSchema,
  getContentByTagSchema,
  tagSchema,
  updateTagSchema,
} from "./schemas/tagSchema";
import {
  userLoginSchema,
  userRegisterSchema,
  watchContentSchema,
} from "./schemas/userSchema";

export async function routes(app: FastifyTypeInstance) {
  // Admin routes
  app.post(
    "/admin/register",
    {
      schema: {
        tags: ["Admin"],
        summary: "Register a new admin",
        deprecated: false,
        body: adminRegisterSchema,
        response: {
          201: z.object({ success: z.boolean(), message: z.string() }),
          400: z.object({ success: z.boolean(), message: z.string() }),
          401: z.object({ success: z.boolean(), message: z.string() }),
          402: z.object({ success: z.boolean(), message: z.string() }),
          500: z.object({ success: z.boolean(), message: z.string() }),
        },
      },
    },
    adminController.register
  );

  app.post(
    "/admin/login",
    {
      schema: {
        tags: ["Admin"],
        summary: "Login as admin",
        deprecated: false,
        body: adminLoginSchema,
        response: {
          201: z.object({ success: z.boolean(), message: z.string() }),
          400: z.object({ success: z.boolean(), message: z.string() }),
          401: z.object({ success: z.boolean(), message: z.string() }),
          404: z.object({ success: z.boolean(), message: z.string() }),
          500: z.object({ success: z.boolean(), message: z.string() }),
        },
      },
    },
    adminController.login
  );

  // User routes
  app.post(
    "/user/register",
    {
      schema: {
        tags: ["User"],
        summary: "Register a new user",
        deprecated: false,
        body: userRegisterSchema,
        response: {
          201: z.object({ success: z.boolean(), message: z.string() }),
          400: z.object({ success: z.boolean(), message: z.string() }),
          402: z.object({ success: z.boolean(), message: z.string() }),
          500: z.object({ success: z.boolean(), message: z.string() }),
        },
      },
    },
    userController.register
  );

  app.post(
    "/user/login",
    {
      schema: {
        tags: ["User"],
        summary: "Login as user",
        deprecated: false,
        body: userLoginSchema,
        response: {
          201: z.object({ success: z.boolean(), message: z.string() }),
          400: z.object({ success: z.boolean(), message: z.string() }),
          401: z.object({ success: z.boolean(), message: z.string() }),
          404: z.object({ success: z.boolean(), message: z.string() }),
          500: z.object({ success: z.boolean(), message: z.string() }),
        },
      },
    },
    userController.login
  );

  app.put(
    "/user/watch-content",
    {
      schema: {
        tags: ["User"],
        summary: "Watch content",
        deprecated: false,
        body: watchContentSchema,
        response: {
          203: z.object({ success: z.boolean(), message: z.string() }),
          400: z.object({ success: z.boolean(), message: z.string() }),
          401: z.object({ success: z.boolean(), message: z.string() }),
          404: z.object({ success: z.boolean(), message: z.string() }),
          500: z.object({ success: z.boolean(), message: z.string() }),
        },
      },
    },
    userController.watchContent
  );

  app.put(
    "/user/watch-later",
    {
      schema: {
        tags: ["User"],
        summary: "Watch later",
        deprecated: false,
        body: watchContentSchema,
        response: {
          203: z.object({ success: z.boolean(), message: z.string() }),
          400: z.object({ success: z.boolean(), message: z.string() }),
          401: z.object({ success: z.boolean(), message: z.string() }),
          404: z.object({ success: z.boolean(), message: z.string() }),
          500: z.object({ success: z.boolean(), message: z.string() }),
        },
      },
    },
    userController.watchLater
  );

  // Token routes
  app.get(
    "/validate/token",
    {
      schema: {
        tags: ["Token"],
        summary: "Validate token",
        deprecated: false,
        response: {
          200: z.object({
            success: z.boolean(),
            message: z.string(),
            role: z.string(),
          }),
          401: z.object({ success: z.boolean(), message: z.string() }),
        },
      },
    },
    cookieService.validateToken
  );

  app.get(
    "/logout",
    {
      schema: {
        tags: ["Token"],
        summary: "Logout",
        deprecated: false,
        response: {
          200: z.object({ success: z.boolean(), message: z.string() }),
        },
      },
    },
    cookieService.logout
  );

  // Movie routes
  app.get(
    "/movie",
    {
      schema: {
        tags: ["Movie"],
        summary: "Get all movies",
        deprecated: false,
        response: {
          200: z.object({ success: z.boolean(), movies: movieSchema.array() }),
          500: z.object({ success: z.boolean(), message: z.string() }),
        },
      },
    },
    moviesController.getAll
  );

  app.post(
    "/movie",
    {
      schema: {
        tags: ["Movie"],
        summary: "Create a movie",
        deprecated: false,
        body: createMovieSchema,
        response: {
          201: z.object({ success: z.boolean(), message: z.string() }),
          400: z.object({ success: z.boolean(), message: z.string() }),
          401: z.object({ success: z.boolean(), message: z.string() }),
          403: z.object({ success: z.boolean(), message: z.string() }),
          500: z.object({ success: z.boolean(), message: z.string() }),
        },
      },
    },
    moviesController.create
  );

  app.put<{ Params: { id: string } }>(
    "/movie/:id",
    {
      schema: {
        tags: ["Movie"],
        summary: "Update a movie",
        deprecated: false,
        body: updateMovieSchema,
        response: {
          203: z.object({ success: z.boolean(), message: z.string() }),
          400: z.object({ success: z.boolean(), message: z.string() }),
          401: z.object({ success: z.boolean(), message: z.string() }),
          403: z.object({ success: z.boolean(), message: z.string() }),
          500: z.object({ success: z.boolean(), message: z.string() }),
        },
      },
    },
    moviesController.update
  );

  app.delete<{ Params: { id: string } }>(
    "/movie/:id",
    {
      schema: {
        tags: ["Movie"],
        summary: "Delete a movie",
        deprecated: false,
        response: {
          204: z.object({ success: z.boolean(), message: z.string() }),
          401: z.object({ success: z.boolean(), message: z.string() }),
          403: z.object({ success: z.boolean(), message: z.string() }),
          500: z.object({ success: z.boolean(), message: z.string() }),
        },
      },
    },
    moviesController.delete
  );

  // Series routes
  app.get(
    "/series",
    {
      schema: {
        tags: ["Series"],
        summary: "Get all series",
        deprecated: false,
        response: {
          200: z.object({
            success: z.boolean(),
            tvShow: seriesSchema.array(),
            soapOpera: seriesSchema.array(),
            anime: seriesSchema.array(),
          }),
          500: z.object({ success: z.boolean(), message: z.string() }),
        },
      },
    },
    seriesController.getAll
  );

  app.post(
    "/series/soap-opera",
    {
      schema: {
        tags: ["Series"],
        summary: "Create a soap opera",
        deprecated: false,
        body: createSeriesSchema,
        response: {
          201: z.object({ success: z.boolean(), message: z.string() }),
          400: z.object({ success: z.boolean(), message: z.string() }),
          401: z.object({ success: z.boolean(), message: z.string() }),
          403: z.object({ success: z.boolean(), message: z.string() }),
          500: z.object({ success: z.boolean(), message: z.string() }),
        },
      },
    },
    seriesController.createSoapOpera
  );

  app.post(
    "/series/tv-show",
    {
      schema: {
        tags: ["Series"],
        summary: "Create a tv show",
        deprecated: false,
        body: createSeriesSchema,
        response: {
          201: z.object({ success: z.boolean(), message: z.string() }),
          400: z.object({ success: z.boolean(), message: z.string() }),
          401: z.object({ success: z.boolean(), message: z.string() }),
          403: z.object({ success: z.boolean(), message: z.string() }),
          500: z.object({ success: z.boolean(), message: z.string() }),
        },
      },
    },
    seriesController.createTvShow
  );

  app.post(
    "/series/anime",
    {
      schema: {
        tags: ["Series"],
        summary: "Create an anime",
        deprecated: false,
        body: createSeriesSchema,
        response: {
          201: z.object({ success: z.boolean(), message: z.string() }),
          400: z.object({ success: z.boolean(), message: z.string() }),
          401: z.object({ success: z.boolean(), message: z.string() }),
          403: z.object({ success: z.boolean(), message: z.string() }),
          500: z.object({ success: z.boolean(), message: z.string() }),
        },
      },
    },
    seriesController.createAnime
  );

  app.put<{ Params: { id: string } }>(
    "/series/:id",
    {
      schema: {
        tags: ["Series"],
        summary: "Update a series",
        deprecated: false,
        body: updateSeriesSchema,
        response: {
          203: z.object({ success: z.boolean(), message: z.string() }),
          400: z.object({ success: z.boolean(), message: z.string() }),
          401: z.object({ success: z.boolean(), message: z.string() }),
          403: z.object({ success: z.boolean(), message: z.string() }),
          500: z.object({ success: z.boolean(), message: z.string() }),
        },
      },
    },
    seriesController.update
  );

  app.delete<{ Params: { id: string } }>(
    "/series/:id",
    {
      schema: {
        tags: ["Series"],
        summary: "Delete a series",
        deprecated: false,
        response: {
          204: z.object({ success: z.boolean(), message: z.string() }),
          401: z.object({ success: z.boolean(), message: z.string() }),
          403: z.object({ success: z.boolean(), message: z.string() }),
          500: z.object({ success: z.boolean(), message: z.string() }),
        },
      },
    },
    seriesController.delete
  );

  // Episode routes
  app.post<{ Params: { seriesID: string } }>(
    "/episode/:seriesID",
    {
      schema: {
        tags: ["Episode"],
        summary: "Create an episode",
        deprecated: false,
        body: createEpisodeSchema,
        response: {
          201: z.object({ success: z.boolean(), message: z.string() }),
          400: z.object({ success: z.boolean(), message: z.string() }),
          401: z.object({ success: z.boolean(), message: z.string() }),
          403: z.object({ success: z.boolean(), message: z.string() }),
          500: z.object({ success: z.boolean(), message: z.string() }),
        },
      },
    },
    episodeController.create
  );

  app.put<{ Params: { id: string } }>(
    "/episode/:id",
    {
      schema: {
        tags: ["Episode"],
        summary: "Update an episode",
        deprecated: false,
        body: updateEpisodeSchema,
        response: {
          203: z.object({ success: z.boolean(), message: z.string() }),
          400: z.object({ success: z.boolean(), message: z.string() }),
          401: z.object({ success: z.boolean(), message: z.string() }),
          403: z.object({ success: z.boolean(), message: z.string() }),
          500: z.object({ success: z.boolean(), message: z.string() }),
        },
      },
    },
    episodeController.update
  );

  app.delete<{ Params: { id: string } }>(
    "/episode/:id",
    {
      schema: {
        tags: ["Episode"],
        summary: "Delete an episode",
        deprecated: false,
        response: {
          204: z.object({ success: z.boolean(), message: z.string() }),
          401: z.object({ success: z.boolean(), message: z.string() }),
          403: z.object({ success: z.boolean(), message: z.string() }),
          500: z.object({ success: z.boolean(), message: z.string() }),
        },
      },
    },
    episodeController.delete
  );

  // Tag routes
  app.get(
    "/tag",
    {
      schema: {
        tags: ["Tag"],
        summary: "Get all tags",
        deprecated: false,
        response: {
          200: z.object({ success: z.boolean(), tags: tagSchema.array() }),
          500: z.object({ success: z.boolean(), message: z.string() }),
        },
      },
    },
    tagController.getAll
  );

  app.post(
    "/tag/content",
    {
      schema: {
        tags: ["Tag"],
        summary: "Get content by tag",
        deprecated: false,
        body: getContentByTagSchema,
        response: {
          200: z.object({
            success: z.boolean(),
            content: movieSchema.array() || seriesSchema.array(),
          }),
          400: z.object({ success: z.boolean(), message: z.string() }),
          500: z.object({ success: z.boolean(), message: z.string() }),
        },
      },
    },
    tagController.getContentByTag
  );

  app.post(
    "/tag",
    {
      schema: {
        tags: ["Tag"],
        summary: "Create a tag",
        deprecated: false,
        body: createTagSchema,
        response: {
          201: z.object({ success: z.boolean(), message: z.string() }),
          400: z.object({ success: z.boolean(), message: z.string() }),
          401: z.object({ success: z.boolean(), message: z.string() }),
          403: z.object({ success: z.boolean(), message: z.string() }),
          500: z.object({ success: z.boolean(), message: z.string() }),
        },
      },
    },
    tagController.create
  );

  app.put<{ Params: { id: string } }>(
    "/tag/:id",
    {
      schema: {
        tags: ["Tag"],
        summary: "Update a tag",
        deprecated: false,
        body: updateTagSchema,
        response: {
          203: z.object({ success: z.boolean(), message: z.string() }),
          400: z.object({ success: z.boolean(), message: z.string() }),
          401: z.object({ success: z.boolean(), message: z.string() }),
          403: z.object({ success: z.boolean(), message: z.string() }),
          500: z.object({ success: z.boolean(), message: z.string() }),
        },
      },
    },
    tagController.update
  );

  app.delete<{ Params: { id: string } }>(
    "/tag/:id",
    {
      schema: {
        tags: ["Tag"],
        summary: "Delete a tag",
        deprecated: false,
        response: {
          204: z.object({ success: z.boolean(), message: z.string() }),
          401: z.object({ success: z.boolean(), message: z.string() }),
          403: z.object({ success: z.boolean(), message: z.string() }),
          500: z.object({ success: z.boolean(), message: z.string() }),
        },
      },
    },
    tagController.delete
  );

  // Health check route
  app.get("/health", (request, reply) => {
    reply.send({ status: "ok" });
  });
}
