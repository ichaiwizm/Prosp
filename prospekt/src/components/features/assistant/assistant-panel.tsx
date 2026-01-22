"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { AssistantMessage, AssistantContext, AssistantResponse } from "@/types";
import {
  X,
  Send,
  Sparkles,
  User,
  Bot,
  Target,
  HelpCircle,
  AlertTriangle,
  BookOpen,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface AssistantPanelProps {
  context: AssistantContext;
  onClose: () => void;
}

export function AssistantPanel({ context, onClose }: AssistantPanelProps) {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [systemInfo, setSystemInfo] = useState<{
    callObjective?: string;
    suggestedQuestions?: string[];
    possibleObjections?: string[];
    relevantDocs?: any[];
  }>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize conversation with context
    initializeConversation();
  }, [context]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initializeConversation = async () => {
    if (!context.prospectId || !context.prospect) return;

    const welcomeMessage: AssistantMessage = {
      role: "assistant",
      content: `Bonjour! Je suis votre assistant IA pour vous aider avec ${context.prospect.contact_name}. Je peux vous aider à préparer votre appel, répondre à vos questions, et gérer les objections.`,
      timestamp: new Date().toISOString(),
    };

    setMessages([welcomeMessage]);

    // Generate system information
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message:
            "Analyse ce prospect et génère: 1) Un objectif pour l'appel 2) 3 questions stratégiques à poser 3) 3 objections possibles",
          prospectId: context.prospectId,
          context: JSON.stringify({
            prospect: context.prospect,
            exchanges: context.exchanges,
            notes: context.notes,
          }),
        }),
      });

      if (response.ok) {
        const data: AssistantResponse = await response.json();

        // Parse the response to extract structured info
        // For now, just display it as a message
        const systemMessage: AssistantMessage = {
          role: "system",
          content: data.message,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, systemMessage]);

        // You can parse the response to populate systemInfo
        setSystemInfo({
          callObjective: context.callObjective,
          suggestedQuestions: context.suggestedQuestions || [],
          possibleObjections: context.possibleObjections || [],
          relevantDocs: context.relevantDocs || [],
        });
      }
    } catch (error) {
      console.error("Error initializing conversation:", error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: AssistantMessage = {
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input.trim(),
          prospectId: context.prospectId,
          context: JSON.stringify({
            prospect: context.prospect,
            exchanges: context.exchanges,
            notes: context.notes,
            conversationHistory: messages,
          }),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from assistant");
      }

      const data: AssistantResponse = await response.json();

      const assistantMessage: AssistantMessage = {
        role: "assistant",
        content: data.message,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage: AssistantMessage = {
        role: "assistant",
        content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <CardHeader className="border-b shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Assistant IA</CardTitle>
                {context.prospect && (
                  <p className="text-sm text-muted-foreground">
                    Prospect: {context.prospect.contact_name}
                  </p>
                )}
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Sidebar with context info */}
          <div className="w-80 border-r p-4 overflow-y-auto shrink-0 hidden lg:block">
            <div className="space-y-6">
              {/* Prospect info */}
              {context.prospect && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Informations
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Email:</span>{" "}
                      {context.prospect.email}
                    </p>
                    {context.prospect.phone && (
                      <p>
                        <span className="text-muted-foreground">Tél:</span>{" "}
                        {context.prospect.phone}
                      </p>
                    )}
                    {context.prospect.company_name && (
                      <p>
                        <span className="text-muted-foreground">
                          Entreprise:
                        </span>{" "}
                        {context.prospect.company_name}
                      </p>
                    )}
                    <Badge variant="outline">{context.prospect.status}</Badge>
                  </div>
                </div>
              )}

              {/* Call objective */}
              {systemInfo.callObjective && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Objectif de l'appel
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {systemInfo.callObjective}
                  </p>
                </div>
              )}

              {/* Suggested questions */}
              {systemInfo.suggestedQuestions &&
                systemInfo.suggestedQuestions.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      Questions à poser
                    </h3>
                    <ul className="space-y-1.5">
                      {systemInfo.suggestedQuestions.map((q, i) => (
                        <li
                          key={i}
                          className="text-sm text-muted-foreground list-disc ml-4"
                        >
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Possible objections */}
              {systemInfo.possibleObjections &&
                systemInfo.possibleObjections.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Objections possibles
                    </h3>
                    <ul className="space-y-1.5">
                      {systemInfo.possibleObjections.map((obj, i) => (
                        <li
                          key={i}
                          className="text-sm text-muted-foreground list-disc ml-4"
                        >
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Relevant docs */}
              {systemInfo.relevantDocs &&
                systemInfo.relevantDocs.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Documents utiles
                    </h3>
                    <div className="space-y-1.5">
                      {systemInfo.relevantDocs.map((doc) => (
                        <a
                          key={doc.id}
                          href={`/docs/${doc.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm text-primary hover:underline"
                        >
                          {doc.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              {/* Recent exchanges */}
              {context.exchanges && context.exchanges.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Derniers échanges</h3>
                  <div className="space-y-2">
                    {context.exchanges.slice(0, 3).map((exchange: any) => (
                      <div key={exchange.id} className="text-sm">
                        <Badge variant="secondary" className="text-xs">
                          {exchange.type}
                        </Badge>
                        <p className="text-muted-foreground mt-1 line-clamp-2">
                          {exchange.content?.substring(0, 80)}...
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  {message.role !== "user" && (
                    <div className="flex items-start justify-center w-8 h-8 rounded-full bg-primary/10 shrink-0 mt-1">
                      <Bot className="h-4 w-4 text-primary mt-2" />
                    </div>
                  )}

                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-4 py-3 space-y-2",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : message.role === "system"
                          ? "bg-muted/50 border"
                          : "bg-muted",
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                    {message.timestamp && (
                      <p
                        className={cn(
                          "text-xs",
                          message.role === "user"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground",
                        )}
                      >
                        {format(new Date(message.timestamp), "HH:mm", {
                          locale: fr,
                        })}
                      </p>
                    )}
                  </div>

                  {message.role === "user" && (
                    <div className="flex items-start justify-center w-8 h-8 rounded-full bg-primary shrink-0 mt-1">
                      <User className="h-4 w-4 text-primary-foreground mt-2" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3">
                  <div className="flex items-start justify-center w-8 h-8 rounded-full bg-primary/10 shrink-0">
                    <Loader2 className="h-4 w-4 text-primary animate-spin mt-2" />
                  </div>
                  <div className="bg-muted rounded-lg px-4 py-3">
                    <p className="text-sm text-muted-foreground">
                      En train d'écrire...
                    </p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <CardContent className="border-t shrink-0 pt-4">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Posez votre question..."
                  disabled={loading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  size="icon"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Appuyez sur Entrée pour envoyer
              </p>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
}
