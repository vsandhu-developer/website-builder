import { Fragment } from "@/lib/generated/prisma/client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import MessagesCard from "./message-card";
import MessageForm from "./message-form";
import { MessageLoading } from "./message-loading";

interface Props {
  projectId: string;
  activeFragment: Fragment | null;
  setActiveFragment: (fragment: Fragment | null) => void;
}

export default function MessagesContainer({
  projectId,
  activeFragment,
  setActiveFragment,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const trpc = useTRPC();

  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions(
      { projectId },
      {
        refetchInterval: 5000,
      }
    )
  );

  // useEffect(() => {
  //   const lastAssistantMessageWithFragment = messages.findLast(
  //     (message) => message.role == "ASSISTANT" && !!message.Fragment
  //   );

  //   if (lastAssistantMessageWithFragment) {
  //     setActiveFragment(lastAssistantMessageWithFragment.Fragment);
  //   }
  // }, [messages, setActiveFragment]);

  useEffect(() => {
    bottomRef?.current?.scrollIntoView();
  }, [messages.length]);

  const lastMessage = messages[messages.length - 1];

  const isLastMessage = lastMessage.role === "USER";

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="pt-2 pr-1">
          {messages.map((message) => (
            <MessagesCard
              key={message.id}
              content={message.content}
              role={message.role}
              fragment={message.Fragment}
              createdAt={message.createdAt}
              isActive={activeFragment?.id === message.Fragment?.id}
              onFragmentClick={() => setActiveFragment(message.Fragment)}
              type={message.message}
            />
          ))}
          {isLastMessage && <MessageLoading />}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="relative p-3 pt-1">
        <div className="absolute -top-6 left-0 right-0 h-6 bg-linear-to-b from-transparent to-background/70 pointer-events-none" />
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
}
