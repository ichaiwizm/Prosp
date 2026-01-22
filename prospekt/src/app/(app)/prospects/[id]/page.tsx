"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AssistantButton } from "@/components/features/assistant/assistant-button";
import type { Prospect, Exchange, Note, AssistantContext } from "@/types";

// Helper function for status badge styling
function getStatusStyle(status: string): string {
  const styles: Record<string, string> = {
    lead: "bg-gray-100 text-gray-800",
    contacted: "bg-blue-100 text-blue-800",
    qualified: "bg-purple-100 text-purple-800",
    proposal: "bg-yellow-100 text-yellow-800",
    negotiation: "bg-orange-100 text-orange-800",
    won: "bg-green-100 text-green-800",
    lost: "bg-red-100 text-red-800",
  };
  return styles[status] || "bg-gray-100 text-gray-800";
}

// Helper function for status label
function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    lead: "Lead",
    contacted: "Contacté",
    qualified: "Qualifié",
    proposal: "Proposition",
    negotiation: "Négociation",
    won: "Gagné",
    lost: "Perdu",
    IN_DISCUSSION: "En discussion",
    NEW: "Nouveau",
    TO_CONTACT: "À contacter",
    NEED_CONFIRMED: "Besoin confirmé",
    IN_PROGRESS: "En cours",
    WON: "Gagné",
    LOST: "Perdu",
    ON_HOLD: "En pause",
  };
  return labels[status] || status;
}

// Helper function for priority badge styling
function getPriorityStyle(priority: string): string {
  const styles: Record<string, string> = {
    low: "bg-slate-100 text-slate-700",
    medium: "bg-blue-100 text-blue-700",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700",
  };
  return styles[priority] || "bg-slate-100 text-slate-700";
}

// Helper function for priority label
function getPriorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    low: "Basse",
    medium: "Moyenne",
    high: "Haute",
    urgent: "Urgente",
    LOW: "Basse",
    MEDIUM: "Moyenne",
    HIGH: "Haute",
    URGENT: "Urgente",
  };
  return labels[priority] || priority;
}

// Helper function for exchange type label
function getExchangeTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    email: "Email",
    call: "Appel",
    meeting: "Réunion",
    linkedin: "LinkedIn",
    other: "Autre",
  };
  return labels[type] || type;
}

// Helper function for note type label
function getNoteTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    general: "Général",
    call: "Appel",
    meeting: "Réunion",
    reminder: "Rappel",
    followup: "Suivi",
  };
  return labels[type] || type || "Général";
}

// Format date helper
function formatDate(dateString?: string): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ProspectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all data in parallel for better performance
        const [prospectRes, exchangesRes, notesRes] = await Promise.all([
          fetch(`/api/prospects/${id}`),
          fetch(`/api/prospects/${id}/exchanges`),
          fetch(`/api/prospects/${id}/notes`),
        ]);

        // Handle prospect data (required)
        if (!prospectRes.ok) throw new Error("Impossible de charger le prospect");
        const prospectData = await prospectRes.json();
        setProspect(prospectData);

        // Handle exchanges data (optional)
        if (exchangesRes.ok) {
          const exchangesData = await exchangesRes.json();
          setExchanges(exchangesData);
        }

        // Handle notes data (optional)
        if (notesRes.ok) {
          const notesData = await notesRes.json();
          setNotes(notesData);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              <p className="text-lg font-semibold">Erreur</p>
              <p>{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push("/prospects")}
              >
                Retour à la liste
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!prospect) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-lg font-semibold">Prospect introuvable</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push("/prospects")}
              >
                Retour à la liste
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/prospects">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{prospect.company_name}</h1>
            <p className="text-muted-foreground">{prospect.contact_name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <AssistantButton
            context={{
              prospect,
              exchanges,
              notes,
            }}
            variant="outline"
          />
          <Button asChild>
            <Link href={`/prospects/${id}/edit`}>Modifier</Link>
          </Button>
        </div>
      </div>

      {/* Status and Priority Badges */}
      <div className="flex gap-3">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(prospect.status)}`}
        >
          {getStatusLabel(prospect.status)}
        </span>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityStyle(prospect.priority)}`}
        >
          Priorité: {getPriorityLabel(prospect.priority)}
        </span>
      </div>

      {/* Contact Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de contact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Contact</p>
              <p className="font-medium">{prospect.contact_name || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              {prospect.email ? (
                <a
                  href={`mailto:${prospect.email}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {prospect.email}
                </a>
              ) : (
                <p className="font-medium">-</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Téléphone</p>
              {prospect.phone ? (
                <a
                  href={`tel:${prospect.phone}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {prospect.phone}
                </a>
              ) : (
                <p className="font-medium">-</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Site web</p>
              {prospect.website ? (
                <a
                  href={
                    prospect.website.startsWith("http")
                      ? prospect.website
                      : `https://${prospect.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:underline"
                >
                  {prospect.website}
                </a>
              ) : (
                <p className="font-medium">-</p>
              )}
            </div>
            {prospect.source && (
              <div>
                <p className="text-sm text-muted-foreground">Source</p>
                <p className="font-medium">{prospect.source}</p>
              </div>
            )}
            {prospect.last_exchange && (
              <div>
                <p className="text-sm text-muted-foreground">Dernier échange</p>
                <p className="font-medium">{formatDate(prospect.last_exchange)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Needs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Besoin potentiel</CardTitle>
            <CardDescription>Ce que le prospect pourrait rechercher</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">
              {prospect.potential_need || "Aucun besoin potentiel identifié."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Besoin confirmé</CardTitle>
            <CardDescription>Besoins validés avec le prospect</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">
              {prospect.confirmed_need || "Aucun besoin confirmé pour le moment."}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tags */}
      {prospect.tags && prospect.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {prospect.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs for Exchanges and Notes */}
      <Tabs defaultValue="exchanges" className="w-full">
        <TabsList>
          <TabsTrigger value="exchanges">
            Échanges ({exchanges.length})
          </TabsTrigger>
          <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="exchanges">
          <Card>
            <CardHeader>
              <CardTitle>Historique des échanges</CardTitle>
            </CardHeader>
            <CardContent>
              {exchanges.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Aucun échange enregistré pour ce prospect.
                </p>
              ) : (
                <div className="space-y-4">
                  {exchanges.map((exchange) => (
                    <div
                      key={exchange.id}
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {getExchangeTypeLabel(exchange.type)}
                          </span>
                          {exchange.direction && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                              {exchange.direction === "inbound"
                                ? "Entrant"
                                : "Sortant"}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(exchange.created_at)}
                        </span>
                      </div>
                      {exchange.subject && (
                        <h4 className="font-medium mt-2">{exchange.subject}</h4>
                      )}
                      {exchange.content && (
                        <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                          {exchange.content}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {notes.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Aucune note pour ce prospect.
                </p>
              ) : (
                <div className="space-y-4">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className={`border rounded-lg p-4 hover:bg-muted/50 transition-colors ${
                        note.is_pinned ? "border-yellow-400 bg-yellow-50/50" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {note.is_pinned && (
                            <span className="text-yellow-600">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            </span>
                          )}
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            {getNoteTypeLabel(note.type || "general")}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(note.created_at)}
                        </span>
                      </div>
                      <p className="text-sm mt-2 whitespace-pre-wrap">
                        {note.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Metadata */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Créé le: {formatDate(prospect.created_at)}</span>
            <span>Mis à jour le: {formatDate(prospect.updated_at)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
