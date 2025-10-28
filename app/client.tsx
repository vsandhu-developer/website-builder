"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function ClientTRPCExample() {
  const trpc = useTRPC();
  const [value, setValue] = useState("");

  const invoke = useMutation(
    trpc.invoke.mutationOptions({
      onSuccess: () => {
        toast.success("Background Job Started");
      },
    })
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button
        disabled={invoke.isPending}
        onClick={() => invoke.mutate({ value })}
      >
        Invoke Background Job
      </Button>
    </div>
  );
}
