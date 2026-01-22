"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AssistantPanel } from "./assistant-panel";
import { AssistantContext } from "@/types";
import { Sparkles } from "lucide-react";

interface AssistantButtonProps {
  context: AssistantContext;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function AssistantButton({
  context,
  variant = "default",
  size = "default",
  className,
}: AssistantButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsOpen(true)}
        className={className}
      >
        <Sparkles className="h-4 w-4 mr-2" />
        Assistant IA
      </Button>

      {isOpen && (
        <AssistantPanel context={context} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
