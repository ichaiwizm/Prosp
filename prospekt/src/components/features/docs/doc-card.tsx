"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KnowledgeDoc } from "@/types";
import { FileText, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface DocCardProps {
  doc: KnowledgeDoc;
}

const categoryLabels: Record<string, string> = {
  SITUATION: "Situation",
  SERVICE: "Service",
  PROCESS: "Processus",
  TEMPLATE: "Template",
};

const categoryColors: Record<string, string> = {
  SITUATION:
    "bg-blue-500/10 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-800",
  SERVICE:
    "bg-green-500/10 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-800",
  PROCESS:
    "bg-purple-500/10 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-800",
  TEMPLATE:
    "bg-orange-500/10 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-800",
};

export function DocCard({ doc }: DocCardProps) {
  const excerpt =
    doc.content.substring(0, 150) + (doc.content.length > 150 ? "..." : "");
  const timeAgo = formatDistanceToNow(new Date(doc.updated_at), {
    addSuffix: true,
    locale: fr,
  });

  return (
    <Link href={`/docs/${doc.id}`} className="block">
      <Card className="hover:shadow-md transition-all hover:border-primary/50 cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
              <Badge
                variant="outline"
                className={categoryColors[doc.category] || ""}
              >
                {categoryLabels[doc.category] || doc.category}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Clock className="h-3 w-3" />
              <span>{timeAgo}</span>
            </div>
          </div>
          <CardTitle className="text-lg line-clamp-2">{doc.title}</CardTitle>
          <CardDescription className="line-clamp-2">{excerpt}</CardDescription>
        </CardHeader>
        {doc.tags && doc.tags.length > 0 && (
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {doc.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
