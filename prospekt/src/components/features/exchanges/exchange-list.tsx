"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { exchangesApi } from "@/lib/api-client";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Phone,
  Mail,
  Calendar,
  Linkedin,
  MessageSquare,
  Plus,
} from "lucide-react";
import type { Exchange, CreateExchangeRequest } from "@/types/database.types";

interface ExchangeListProps {
  prospectId: string;
}

const exchangeIcons = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  linkedin: Linkedin,
  other: MessageSquare,
};

const exchangeColors = {
  call: "bg-blue-100 text-blue-700 border-blue-200",
  email: "bg-purple-100 text-purple-700 border-purple-200",
  meeting: "bg-green-100 text-green-700 border-green-200",
  linkedin: "bg-indigo-100 text-indigo-700 border-indigo-200",
  other: "bg-gray-100 text-gray-700 border-gray-200",
};

export function ExchangeList({ prospectId }: ExchangeListProps) {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateExchangeRequest>({
    prospect_id: prospectId,
    type: "call",
    subject: "",
    content: "",
    direction: "outbound",
    status: "completed",
  });

  useEffect(() => {
    loadExchanges();
  }, [prospectId]);

  const loadExchanges = async () => {
    try {
      setIsLoading(true);
      const data = await exchangesApi.listByProspect(prospectId);
      setExchanges(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des \u00e9changes");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await exchangesApi.create(formData);
      toast.success("\u00c9change ajout\u00e9 avec succ\u00e8s");
      setIsDialogOpen(false);
      setFormData({
        prospect_id: prospectId,
        type: "call",
        subject: "",
        content: "",
        direction: "outbound",
        status: "completed",
      });
      loadExchanges();
    } catch (error) {
      toast.error("Erreur lors de l'ajout de l'\u00e9change");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-24 bg-muted animate-pulse rounded-lg" />
        <div className="h-24 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Historique des \u00e9changes</h3>
        <Button onClick={() => setIsDialogOpen(true)} size="sm">
          <Plus className="size-4" />
          Nouvel \u00e9change
        </Button>
      </div>

      {exchanges.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          Aucun \u00e9change enregistr\u00e9
        </Card>
      ) : (
        <div className="space-y-4">
          {exchanges.map((exchange) => {
            const Icon = exchangeIcons[exchange.type];
            const colorClass = exchangeColors[exchange.type];

            return (
              <Card key={exchange.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon className="size-5" />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">
                          {exchange.subject || "Sans titre"}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {exchange.created_at &&
                            format(
                              new Date(exchange.created_at),
                              "PPP \u00e0 HH:mm",
                              { locale: fr },
                            )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {exchange.direction === "inbound"
                            ? "Entrant"
                            : "Sortant"}
                        </Badge>
                        <Badge
                          variant={
                            exchange.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                          className="capitalize"
                        >
                          {exchange.status === "completed"
                            ? "Termin\u00e9"
                            : exchange.status}
                        </Badge>
                      </div>
                    </div>

                    {exchange.content && (
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {exchange.content}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvel \u00e9change</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-medium">
                  Type
                </label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      type: value as Exchange["type"],
                    }))
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">Appel</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="meeting">R\u00e9union</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="direction" className="text-sm font-medium">
                  Direction
                </label>
                <Select
                  value={formData.direction}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      direction: value as Exchange["direction"],
                    }))
                  }
                >
                  <SelectTrigger id="direction">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inbound">Entrant</SelectItem>
                    <SelectItem value="outbound">Sortant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Objet
              </label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, subject: e.target.value }))
                }
                placeholder="Ex: Premier contact, suivi proposition..."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Notes
              </label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="D\u00e9taillez l'\u00e9change..."
                rows={4}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Ajout..." : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
