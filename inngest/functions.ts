import { createAgent, openai } from "@inngest/agent-kit";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const writer = createAgent({
      name: "writer",
      system: `You are an expert next js developer. You write readable, maintainable code. You write simple Next.Js and React snippets.`,
      model: openai({ model: "gpt-5-mini" }),
    });

    const { output } = await writer.run(`User Input: ${event.data.value}`);

    return output;
  }
);
