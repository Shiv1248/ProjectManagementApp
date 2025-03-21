import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

export const userRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
        image: z.string()
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: input.password,
          image: input.image,
        },
      });
    }),

  getUsers: publicProcedure.query(async () => {
    return await prisma.user.findMany();
  }),

  getUserById: publicProcedure.input(z.number()).query(async ({ input }) => {
    return await prisma.user.findUnique({ where: { id: input } });
  }),

  updateUser: publicProcedure
    .input(
      z.object({
        id: z.number(),
        updates: z.object({
          name: z.string().optional(),
          image: z.string().optional(),
          emailVerified: z.string().optional(),
          password: z.string().optional()
        }),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.user.update({
        where: { id: input.id },
        data: input.updates,
      });
    }),

  deleteUser: publicProcedure.input(z.number()).mutation(async ({ input }) => {
    await prisma.user.delete({ where: { id: input } });
    return { message: "User deleted" };
  }),
});
