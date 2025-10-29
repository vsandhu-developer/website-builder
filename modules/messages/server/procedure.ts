import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { MessageRole, MessageType } from "@/lib/generated/prisma/enums";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";

export const messagesRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        projectId: z.string().min(1, "Project Id is required"),
      })
    )
    .query(async ({ input }) => {
      const messages = await prisma.message.findMany({
        where: {
          projectId: input.projectId,
        },
        include: {
          Fragment: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      return messages;
    }),
  create: baseProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { error: "Prompt is required" })
          .max(10000, { error: "Message too long" }),
        projectId: z.string().min(1, "Project Id is required"),
      })
    )
    .mutation(async ({ input }) => {
      const message = await prisma.message.create({
        data: {
          content: input.value,
          role: MessageRole.USER,
          message: MessageType.RESULT,
          projectId: input.projectId,
        },
      });

      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          projectId: input.projectId,
        },
      });

      return message;
    }),
});
