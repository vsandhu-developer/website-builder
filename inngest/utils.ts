import { Sandbox } from "@e2b/code-interpreter";

export async function getSandbox(sandboxId: string) {
  const sandbox = Sandbox.connect(sandboxId);
  return sandbox;
}
