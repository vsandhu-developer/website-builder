import ClientTRPCExample from "./client";

export default async function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <ClientTRPCExample />
    </div>
  );
}
