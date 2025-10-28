"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function ClientTRPCExample() {
  const trpc = useTRPC();
  const [value, setValue] = useState("");

  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        toast.success("Background Job Started");
      },
    })
  );

  const { data: messages } = useQuery(trpc.messages.getMany.queryOptions());

  return (
    <div className="flex flex-col gap-y-4 max-w-2xl min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black py-8">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-4"
      />
      <Button
        className="w-full"
        disabled={createMessage.isPending}
        onClick={() => createMessage.mutate({ value })}
      >
        Invoke Background Job
      </Button>
      {JSON.stringify(messages, null, 2)}
    </div>
  );
}
