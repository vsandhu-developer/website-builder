import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Fragment } from "@/lib/generated/prisma/client";
import { ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";
import { useState } from "react";

interface Props {
  data: Fragment;
}

export default function FragmentWeb({ data }: Props) {
  const [copied, setCopied] = useState(false);
  const [fragmentKey, setFragmentKey] = useState(0);

  const onRefresh = () => {
    setFragmentKey((prev) => prev + 1);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data.sandboxUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
        <Hint text="Refresh Website">
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={onRefresh}
            className="cursor-pointer"
          >
            <RefreshCcwIcon />
          </Button>
        </Hint>

        <Hint text="Copy URL">
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={handleCopy}
            disabled={!data.sandboxUrl || copied}
            className="flex-1 text-start justify-start font-normal cursor-pointer"
          >
            <span className="truncate">{data.sandboxUrl}</span>
          </Button>
        </Hint>

        <Hint text="Open Link in New Tab">
          <Button
            size={"sm"}
            variant={"outline"}
            className="cursor-pointer"
            onClick={() => {
              if (!data.sandboxUrl) return;
              window.open(data.sandboxUrl, "_blank");
            }}
          >
            <ExternalLinkIcon />
          </Button>
        </Hint>
      </div>
      <iframe
        key={fragmentKey}
        className="h-full w-full"
        sandbox="allow-forms allow-scripts allow-same-origin"
        loading="lazy"
        src={data.sandboxUrl}
      />
    </div>
  );
}
