import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

export const taskRouter = createTRPCRouter({
  createTask: publicProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        deadline: z.string(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
        status: z.enum(["TODO", "IN PROGRESS", "DONE"]),
        userId: z.number(),
        projectId: z.number(),
        tag: z.string().optional()
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.task.create({
        data: {
          title: input.title,
          description: input.description,
          deadline: input.deadline,
          priority: input.priority,
          status: input.status,
          userId: input.userId,
          projectId: input.projectId,
          tag: input.tag || null,
        },
      });
    }),

  getTasks: publicProcedure.query(async () => {
    return await prisma.task.findMany();
  }),

  getTaskById: publicProcedure.input(z.number()).query(async ({ input }) => {
    return await prisma.task.findUnique({ where: { id: input } });
  }),

  updateTask: publicProcedure
    .input(
      z.object({
        id: z.number(),
        updates: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          deadline: z.string().optional(),
          priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
          status: z.enum(["TODO", "IN PROGRESS", "DONE"]).optional(),
          userId: z.number().optional(),
          tag: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.task.update({
        where: { id: input.id },
        data: input.updates,
      });
    }),

  deleteTask: publicProcedure.input(z.number()).mutation(async ({ input }) => {
    await prisma.task.delete({ where: { id: input } });
    return { message: "Task deleted" };
  }),
});
