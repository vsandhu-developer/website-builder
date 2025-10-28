import { Sandbox } from "@e2b/code-interpreter";
import { createAgent, openai } from "@inngest/agent-kit";
import { inngest } from "./client";
import { getSandbox } from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("next-js-starter");
      return sandbox.sandboxId;
    });

    const writer = createAgent({
      name: "writer",
      system: `You are an expert next js developer. You write readable, maintainable code. You write simple Next.Js and React snippets.`,
      model: openai({ model: "gpt-5-mini" }),
    });

    const { output } = await writer.run(`User Input: ${event.data.value}`);

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `http://${host}`;
    });

    return { output, sandboxUrl };
  }
);
