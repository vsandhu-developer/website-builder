import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

interface Props {
  projectId: string;
}

export default function ProjectHeader({ projectId }: Props) {
  const trpc = useTRPC();
  const { data: project } = useSuspenseQuery(
    trpc.projects.getOne.queryOptions({ id: projectId })
  );

  return (
    <header className="p-2 flex justify-between items-center border-b">
      <div className="flex items-center gap-x-2">
        <Link href={"/"}>
          <Image src={"/logo.svg"} alt="Mihu xAI" height={28} width={28} />
        </Link>
        <span>{project.name}</span>
      </div>
    </header>
  );
}
