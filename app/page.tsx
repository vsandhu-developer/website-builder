import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import ClientTRPCExample from "./client";

export default async function Home() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.hello.queryOptions({ text: "vsandhu-developer" })
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<p>Loading...</p>}>
          <ClientTRPCExample />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
