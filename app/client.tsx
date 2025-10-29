"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ClientTRPCExample() {
  const trpc = useTRPC();
  const router = useRouter();
  const [value, setValue] = useState("");

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        toast.success("Generation Started");
        router.push(`/projects/${data.id}`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  return (
    <div className="flex flex-col gap-y-4 max-w-2xl min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black py-8">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-4"
      />
      <Button
        className="w-full"
        disabled={createProject.isPending}
        onClick={() => createProject.mutate({ value })}
      >
        Generate
      </Button>
    </div>
  );
}
