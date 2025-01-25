import { z } from "zod";

import { FastifyTypeInstance } from "./types";
import { adminLoginSchema, adminRegisterSchema } from "./schemas/adminSchemas";
import { adminController } from "./controllers/admin-controller";

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


  
  // Health check route
  app.get("/health", (request, reply) => {
    reply.send({ status: "ok" });
  });
}