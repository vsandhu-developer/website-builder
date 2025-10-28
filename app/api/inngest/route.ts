import { inngest } from "@/inngest/client";
import { codeAgent } from "@/inngest/functions";
import { serve } from "inngest/next";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [codeAgent],
});
