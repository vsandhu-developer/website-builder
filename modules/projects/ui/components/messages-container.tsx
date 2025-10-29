import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import MessagesCard from "./message-card";
import MessageForm from "./message-form";

interface Props {
  projectId: string;
}

export default function MessagesContainer({ projectId }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const trpc = useTRPC();

  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions({ projectId })
  );

  useEffect(() => {
    const lastAssistantMessage = messages.findLast(
      (message) => message.role == "ASSISTANT"
    );

    if (lastAssistantMessage) {
    }
  }, [messages]);

  useEffect(() => {
    bottomRef?.current?.scrollIntoView();
  }, [messages.length]);

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
              isActive={false}
              onFragmentClick={() => {}}
              type={message.message}
            />
          ))}
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
