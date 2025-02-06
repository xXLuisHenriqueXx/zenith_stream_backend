import { z } from "zod";

import { FastifyTypeInstance } from "./types";

import { adminController } from "./controllers/admin-controller";
import { userController } from "./controllers/user-controller";
import { moviesController } from "./controllers/movies-controller";
import { seriesController } from "./controllers/series-controller";
import { episodeController } from "./controllers/episodes-controller";
import { tagController } from "./controllers/tag-controller";

import { adminLoginSchema, adminRegisterSchema } from "./schemas/adminSchemas";
import { userLoginSchema, userRegisterSchema, watchContentSchema } from "./schemas/userSchema";
import { createMovieSchema, movieSchema, updateMovieSchema } from "./schemas/movieSchema";
import { createSeriesSchema, seriesSchema, updateSeriesSchema } from "./schemas/seriesSchema";
import { createEpisodeSchema, episodeSchema, updateEpisodeSchema } from "./schemas/episodeSchema";
import { createTagSchema, getContentByTagSchema, tagSchema, updateTagSchema } from "./schemas/tagSchema";
import { cookieService } from "./services/cookieService";

export async function routes(app: FastifyTypeInstance) {
  // Admin routes
  app.post("/admin/register", {
    schema: {
      tags: ["Admin"],
      deprecated: false,
      description: "Register a new admin",
      body: adminRegisterSchema,
      response: {
        201: z.object({ success: z.boolean(), message: z.string() }),
        400: z.object({ success: z.boolean(), message: z.string() }),
        401: z.object({ success: z.boolean(), message: z.string() }),
        402: z.object({ success: z.boolean(), message: z.string() }),
        500: z.object({ success: z.boolean(), message: z.string() })
      }
    }
  }, adminController.register);

  app.post("/admin/login", {
    schema: {
      tags: ["Admin"],
      deprecated: false,
      description: "Login as admin",
      body: adminLoginSchema,
      response: {
        201: z.object({ success: z.boolean(), message: z.string() }),
        400: z.object({ success: z.boolean(), message: z.string() }),
        401: z.object({ success: z.boolean(), message: z.string() }),
        404: z.object({ success: z.boolean(), message: z.string() }),
        500: z.object({ success: z.boolean(), message: z.string() })
      }
    }
  }, adminController.login);

  

  // User routes
  app.post("/user/register", {
    schema: {
      tags: ["User"],
      deprecated: false,
      description: "Register a new user",
      body: userRegisterSchema,
      response: {
        201: z.object({ success: z.boolean(), message: z.string() }),
        400: z.object({ success: z.boolean(), message: z.string() }),
        402: z.object({ success: z.boolean(), message: z.string() }),
        500: z.object({ success: z.boolean(), message: z.string() })
      }
    }
  }, userController.register);

  app.post("/user/login", {
    schema: {
      tags: ["User"],
      deprecated: false,
      description: "Login as user",
      body: userLoginSchema,
      response: {
        201: z.object({ success: z.boolean(), message: z.string() }),
        400: z.object({ success: z.boolean(), message: z.string() }),
        401: z.object({ success: z.boolean(), message: z.string() }),
        404: z.object({ success: z.boolean(), message: z.string() }),
        500: z.object({ success: z.boolean(), message: z.string() })
      }
    }
  }, userController.login);

  app.put("/user/watch-content", {
    schema: {
      tags: ["User"],
      deprecated: false,
      description: "Watch content",
      body: watchContentSchema,
      response: {
        203: z.object({ success: z.boolean(), message: z.string() }),
        400: z.object({ success: z.boolean(), message: z.string() }),
        401: z.object({ success: z.boolean(), message: z.string() }),
        404: z.object({ success: z.boolean(), message: z.string() }),
        500: z.object({ success: z.boolean(), message: z.string() })
      }
    }
  }, userController.watchContent);

  app.put("/user/watch-later", {
    schema: {
      tags: ["User"],
      deprecated: false,
      description: "Watch later",
      body: watchContentSchema,
      response: {
        203: z.object({ success: z.boolean(), message: z.string() }),
        400: z.object({ success: z.boolean(), message: z.string() }),
        401: z.object({ success: z.boolean(), message: z.string() }),
        404: z.object({ success: z.boolean(), message: z.string() }),
        500: z.object({ success: z.boolean(), message: z.string() })
      }
    }
  }, userController.watchLater);



  // Token routes
  app.get("/validate/token", {
    schema: {
      tags: ["Token"],
      deprecated: false,
      description: "Validate token",
      response: {
        200: z.object({ success: z.boolean(), message: z.string(), role: z.string() }),
        401: z.object({ success: z.boolean(), message: z.string() })
      }
    }
  }, cookieService.validateToken);

  app.get("/logout", {
    schema: {
      tags: ["Token"],
      deprecated: false,
      description: "Logout",
      response: {
        200: z.object({ success: z.boolean(), message: z.string() })
      }
    }
  }, cookieService.logout);
  


  // Movie routes
  app.get("/movie", {
    schema: {
      tags: ["Movie"],
      deprecated: false,
      description: "Get all movies",
      response: {
        200: z.object({ success: z.boolean(), movies: movieSchema.array() }),
        500: z.object({ success: z.boolean(), message: z.string() })
      }
    }
  },moviesController.getAll);

  app.post("/movie", {
    schema: {
      tags: ["Movie"],
      deprecated: false,
      description: "Create a movie",
      body: createMovieSchema,
      response: {
        201: z.object({ success: z.boolean(), message: z.string() }),
        400: z.object({ success: z.boolean(), message: z.string() }),
        401: z.object({ success: z.boolean(), message: z.string() }),
        403: z.object({ success: z.boolean(), message: z.string() }),
        500: z.object({ success: z.boolean(), message: z.string() })
      }
    }
  }, moviesController.create);

  app.put<{ Params: { id: string } }>("/movie/:id", {
    schema: {
      tags: ["Movie"],
      deprecated: false,
      description: "Update a movie",
      body: updateMovieSchema,
      response: {
        203: z.object({ success: z.boolean(), message: z.string() }),
        400: z.object({ success: z.boolean(), message: z.string() }),
        401: z.object({ success: z.boolean(), message: z.string() }),
        403: z.object({ success: z.boolean(), message: z.string() }),
        500: z.object({ success: z.boolean(), message: z.string() })
      }
    }
  }, moviesController.update);

  app.delete<{ Params: { id: string } }>("/movie/:id", {
    schema: {
      tags: ["Movie"],
      deprecated: false,
      description: "Delete a movie",
      response: {
        204: z.object({ success: z.boolean(), message: z.string() }),
        401: z.object({ success: z.boolean(), message: z.string() }),
        403: z.object({ success: z.boolean(), message: z.string() }),
        500: z.object({ success: z.boolean(), message: z.string() })
      }
    }
  }, moviesController.delete);



  // Series routes
  app.get("/series", {
    schema: {
      tags: ["Series"],
      deprecated: false,
      description: "Get all series",
      response: {
        200: z.object({ success: z.boolean(), tvShow: seriesSchema.array(), soapOpera: seriesSchema.array(), anime: seriesSchema.array() }),
        500: z.object({ success: z.boolean(), message: z.string() })
      }
    }
  }, seriesController.getAll);

  app.post("/series/soap-opera", {
    schema: {
      tags: ["Series"],
      deprecated: false,
      description: "Create a soap opera",
      body: createSeriesSchema,
      response: {
        201: z.object({ success: z.boolean(), message: z.string() }),
        400: z.object({ success: z.boolean(), message: z.string() }),
        401: z.object({ success: z.boolean(), message: z.string() }),
        403: z.object({ success: z.boolean(), message: z.string() }),
        500: z.object({ success: z.boolean(), message: z.string() })
      }
    }
  }, seriesController.createSoapOpera);

  app.post("/series/tv-show", {
    schema: {
      tags: ["Series"],
      deprecated: false,
      description: "Create a tv show",
      body: createSeriesSchema,
      response: {
        201: z.object({ success: z.boolean(), message: z.string() }),
        400: z.object({ success: z.boolean(), message: z.string() }),
        401: z.object({ success: z.boolean(), message: z.string() }),
        403: z.object({ success: z.boolean(), message: z.string() }),
        500: z.object({ success: z.boolean(), message: z.string() })
      }
    }
  }, seriesController.createTvShow);

  app.post("/series/anime", {
    schema: {
      tags: ["Series"],
      deprecated: false,
      description: "Create an anime",
      body: createSeriesSchema,
      response: {
        201: z.object({ success: z.boolean(), message: z.string() }),
        400: z.object({ success: z.boolean(), message: z.string() }),
        401: z.object({ success: z.boolean(), message: z.string() }),
        403: z.object({ success: z.boolean(), message: z.string() }),
        500: z.object({ success: z.boolean(), message: z.string() })
      }
    }
  }, seriesController.createAnime);

  app.put<{ Params: { id: string } }>("/series/:id", {
    schema: {
      tags: ["Series"],
      deprecated: false,
      description: "Update a series",
      body: updateSeriesSchema,
      response: {
        203: z.object({ success: z.boolean(), message: z.string() }),
        400: z.object({ success: z.boolean(), message: z.string() }),
        401: z.object({ success: z.boolean(), message: z.string() }),
        403: z.object({ success: z.boolean(), message: z.string() }),
        500: z.object({ success: z.boolean(), message: z.string() })
      }
    }
  }, seriesController.update);

  app.delete<{ Params: { id: string } }>("/series/:id", {
    schema: {
      tags: ["Series"],
      deprecated: false,
      description: "Delete a series",
      response: {
        204: z.object({ success: z.boolean(), message: z.string() }),
        401: z.object({ success: z.boolean(), message: z.string() }),
        403: z.object({ success: z.boolean(), message: z.string() }),
        500: z.object({ success: z.boolean(), message: z.string() })
      }
    }
  }, seriesController.delete);
  


  // Episode routes
  app.post<{ Params: { seriesID: string } }>("/episode/:seriesID", {
    schema: {
      tags: ["Episode"],
      deprecated: false,
      description: "Create an episode",
      body: createEpisodeSchema,
      response: {
        201: z.object({ success: z.boolean(), message: z.string() }),
        400: z.object({ success: z.boolean(), message: z.string() }),
        401: z.object({ success: z.boolean(), message: z.string() }),
        403: z.object({ success: z.boolean(), message: z.string() }),
        500: z.object({ success: z.boolean(), message: z.string() })
      }
    }
  }, episodeController.create);

  app.put<{ Params: { id: string } }>("/episode/:id", {
    schema: {
      tags: ["Episode"],
      deprecated: false,
      description: "Update an episode",
      body: updateEpisodeSchema,
      response: {
        203: z.object({ success: z.boolean(), message: z.string() }),
        400: z.object({ success: z.boolean(), message: z.string() }),
        401: z.object({ success: z.boolean(), message: z.string() }),
        403: z.object({ success: z.boolean(), message: z.string() }),
        500: z.object({ success: z.boolean(), message: z.string() })
      }
    }
  }, episodeController.update);

  app.delete<{ Params: { id: string } }>("/episode/:id", {
    schema: {
      tags: ["Episode"],
      deprecated: false,
      description: "Delete an episode",
      response: {
        204: z.object({ success: z.boolean(), message: z.string() }),
        401: z.object({ success: z.boolean(), message: z.string() }),
        403: z.object({ success: z.boolean(), message: z.string() }),
        500: z.object({ success: z.boolean(), message: z.string() })
      }
    }
  }, episodeController.delete);

  

  // Tag routes
  app.get("/tag", {
    schema: {
      tags: ["Tag"],
      deprecated: false,
      description: "Get all tags",
      response: {
        200: z.object({ success: z.boolean(), tags: tagSchema.array() }),
        500: z.object({ success: z.boolean(), message: z.string() })
      }
    }
  }, tagController.getAll);

  app.post("/tag/content", {
    schema: {
      tags: ["Tag"],
      deprecated: false,
      description: "Get content by tag",
      body: getContentByTagSchema,
      response: {
        200: z.object({ success: z.boolean(), content: movieSchema.array() || seriesSchema.array() }),
        400: z.object({ success: z.boolean(), message: z.string() }),
        500: z.object({ success: z.boolean(), message: z.string() })
      }
    }
  }, tagController.getContentByTag);

  app.post("/tag", {
    schema: {
      tags: ["Tag"],
      deprecated: false,
      description: "Create a tag",
      body: createTagSchema,
      response: {
        201: z.object({ success: z.boolean(), message: z.string() }),
        400: z.object({ success: z.boolean(), message: z.string() }),
        401: z.object({ success: z.boolean(), message: z.string() }),
        403: z.object({ success: z.boolean(), message: z.string() }),
        500: z.object({ success: z.boolean(), message: z.string() })
      }
    }
  }, tagController.create);

  app.put<{ Params: { id: string } }>("/tag/:id", {
    schema: {
      tags: ["Tag"],
      deprecated: false,
      description: "Update a tag",
      body: updateTagSchema,
      response: {
        203: z.object({ success: z.boolean(), message: z.string() }),
        400: z.object({ success: z.boolean(), message: z.string() }),
        401: z.object({ success: z.boolean(), message: z.string() }),
        403: z.object({ success: z.boolean(), message: z.string() }),
        500: z.object({ success: z.boolean(), message: z.string() })
      }
    }
  }, tagController.update);

  app.delete<{ Params: { id: string } }>("/tag/:id", {
    schema: {
      tags: ["Tag"],
      deprecated: false,
      description: "Delete a tag",
      response: {
        204: z.object({ success: z.boolean(), message: z.string() }),
        401: z.object({ success: z.boolean(), message: z.string() }),
        403: z.object({ success: z.boolean(), message: z.string() }),
        500: z.object({ success: z.boolean(), message: z.string() })
      }
    }
  }, tagController.delete);


  
  // Health check route
  app.get("/health", (request, reply) => {
    reply.send({ status: "ok" });
  });
}