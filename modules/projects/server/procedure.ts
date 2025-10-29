import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { MessageRole, MessageType } from "@/lib/generated/prisma/enums";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { generateSlug } from "random-word-slugs";
import z from "zod";

export const projectsRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    return projects;
  }),
  create: baseProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { error: "Prompt is required" })
          .max(10000, { error: "Message too long" }),
      })
    )
    .mutation(async ({ input }) => {
      const createdProject = await prisma.project.create({
        data: {
          name: generateSlug(6, {
            format: "kebab",
          }),
          messages: {
            create: {
              content: input.value,
              role: MessageRole.USER,
              message: MessageType.RESULT,
            },
          },
        },
      });

      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          projectId: createdProject.id,
        },
      });

      return createdProject;
    }),
});
