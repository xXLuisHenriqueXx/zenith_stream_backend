import { z } from "zod";

import { FastifyTypeInstance } from "./types";

import { adminController } from "./controllers/admin-controller";
import { userController } from "./controllers/user-controller";
import { moviesController } from "./controllers/movies-controller";
import { tagController } from "./controllers/tag-controller";

import { adminLoginSchema, adminRegisterSchema } from "./schemas/adminSchemas";
import { userRegisterSchema, watchContentSchema } from "./schemas/userSchema";
import { createMovieSchema, movieSchema, updateMovieSchema } from "./schemas/movieSchema";
import { createSeriesSchema, seriesSchema, updateSeriesSchema } from "./schemas/seriesSchema";
import { createTagSchema, getContentByTagSchema, tagSchema, updateTagSchema } from "./schemas/tagSchema";

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
      body: adminLoginSchema,
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