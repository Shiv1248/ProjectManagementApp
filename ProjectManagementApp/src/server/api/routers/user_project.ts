import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

export const userProjectRouter = createTRPCRouter({
  createUserProject: publicProcedure
    .input(z.object({ userId: z.number(), projectId: z.number() }))
    .mutation(async ({ input }) => {
      return await prisma.userProject.create({
        data: {
          userId: input.userId,
          projectId: input.projectId,
        },
      });
    }),
  
  getUserProject: publicProcedure
    .input(z.object({ userId: z.number(), projectId: z.number() }))
    .query(async ({ input }) => {
      return await prisma.userProject.findUnique({
        where: { 
            userId_projectId: {
                userId: input.userId,
                projectId: input.projectId,
            },
        },
      });
    }),

  deleteUserProject: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await prisma.userProject.delete({
        where: { 
          id: input.id,
        },
      });
    }),
});
