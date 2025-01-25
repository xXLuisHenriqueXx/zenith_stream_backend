import { z } from "zod";

import { FastifyTypeInstance } from "./types";

import { adminController } from "./controllers/admin-controller";

import { adminLoginSchema, adminRegisterSchema } from "./schemas/adminSchemas";
import { userRegisterSchema, watchContentSchema } from "./schemas/userSchema";
import { userController } from "./controllers/user-controller";

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


  
  // Health check route
  app.get("/health", (request, reply) => {
    reply.send({ status: "ok" });
  });
}