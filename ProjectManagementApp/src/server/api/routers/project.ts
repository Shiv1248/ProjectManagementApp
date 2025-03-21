import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

export const projectRouter = createTRPCRouter({
  createProject: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.project.create({
        data: {
          name: input.name,
          description: input.description || "",
        },
      });
    }),

  getProjects: publicProcedure.query(async () => {
    return await prisma.project.findMany();
  }),

  getProjectById: publicProcedure.input(z.string()).query(async ({ input }) => {
    return await prisma.project.findUnique({ where: { id: Number(input) } });
  }),

  updateProject: publicProcedure
    .input(
      z.object({
        id: z.number(),
        updates: z.object({
          name: z.string().optional(),
          description: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.project.update({
        where: { id: input.id },
        data: input.updates,
      });
    }),

  deleteProject: publicProcedure.input(z.number()).mutation(async ({ input }) => {
    await prisma.project.delete({ where: { id: input } });
    return { message: "Project deleted" };
  }),
});
