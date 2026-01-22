"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Prospect, Exchange, Document } from "@/types/database.types";

interface DashboardStats {
  toContactToday: number;
  inDiscussion: number;
  conversionRate: number;
}

export function DashboardCommercial() {
  const [stats, setStats] = useState<DashboardStats>({
    toContactToday: 0,
    inDiscussion: 0,
    conversionRate: 0,
  });
  const [priorityProspects, setPriorityProspects] = useState<Prospect[]>([]);
  const [recentExchanges, setRecentExchanges] = useState<Exchange[]>([]);
  const [suggestedDocs, setSuggestedDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch prospects
        const prospectsRes = await fetch("/api/prospects");
        const prospects: Prospect[] = await prospectsRes.json();

        // Calculate stats
        const today = new Date().toISOString().split("T")[0];
        const toContactToday = prospects.filter(
          (p) => p.status === "lead" || p.status === "contacted",
        ).length;

        const inDiscussion = prospects.filter(
          (p) =>
            p.status === "qualified" ||
            p.status === "proposal" ||
            p.status === "negotiation",
        ).length;

        const won = prospects.filter((p) => p.status === "won").length;
        const total = prospects.length;
        const conversionRate = total > 0 ? Math.round((won / total) * 100) : 0;

        setStats({
          toContactToday,
          inDiscussion,
          conversionRate,
        });

        // Get priority prospects (first 5 with lead or contacted status)
        const priority = prospects
          .filter((p) => p.status === "lead" || p.status === "contacted")
          .slice(0, 5);
        setPriorityProspects(priority);

        // Fetch recent exchanges
        const exchangesRes = await fetch("/api/exchanges");
        if (exchangesRes.ok) {
          const exchanges: Exchange[] = await exchangesRes.json();
          setRecentExchanges(exchanges.slice(0, 5));
        }

        // Fetch suggested docs
        const docsRes = await fetch("/api/docs");
        if (docsRes.ok) {
          const docs: Document[] = await docsRes.json();
          setSuggestedDocs(docs.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const getStatusBadge = (status?: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      lead: "default",
      contacted: "secondary",
      qualified: "outline",
      proposal: "outline",
      negotiation: "outline",
      won: "default",
      lost: "destructive",
    };
    return (
      <Badge variant={variants[status || "lead"] || "default"}>
        {status || "lead"}
      </Badge>
    );
  };

  const getExchangeTypeBadge = (type: string) => {
    const icons: Record<string, string> = {
      email: "📧",
      call: "📞",
      meeting: "👥",
      linkedin: "💼",
      other: "📝",
    };
    return (
      <Badge variant="outline">
        {icons[type] || "📝"} {type}
      </Badge>
    );
  };

  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Prospects à contacter aujourd'hui
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.toContactToday}</div>
            <p className="text-xs text-muted-foreground mt-1">
              En attente de contact
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En discussion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.inDiscussion}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Prospects actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taux de conversion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Prospects convertis
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Prospects prioritaires */}
      <Card>
        <CardHeader>
          <CardTitle>Prospects prioritaires à appeler</CardTitle>
          <CardDescription>Prospects urgents et haute priorité</CardDescription>
        </CardHeader>
        <CardContent>
          {priorityProspects.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Aucun prospect prioritaire pour le moment
            </p>
          ) : (
            <div className="space-y-4">
              {priorityProspects.map((prospect) => (
                <div
                  key={prospect.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{prospect.contact_name}</h4>
                      {getStatusBadge(prospect.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {prospect.company_name && (
                        <span>{prospect.company_name}</span>
                      )}
                      {prospect.email && (
                        <span className="ml-2">• {prospect.email}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/prospects/${prospect.id}`}>Voir</Link>
                    </Button>
                    {prospect.phone && (
                      <Button size="sm" asChild>
                        <a href={`tel:${prospect.phone}`}>Appeler</a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Derniers échanges */}
        <Card>
          <CardHeader>
            <CardTitle>Derniers échanges</CardTitle>
            <CardDescription>5 dernières interactions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentExchanges.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucun échange récent
              </p>
            ) : (
              <div className="space-y-3">
                {recentExchanges.map((exchange) => (
                  <div
                    key={exchange.id}
                    className="p-3 border rounded-lg space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          {getExchangeTypeBadge(exchange.type)}
                          {exchange.direction && (
                            <Badge variant="secondary" className="text-xs">
                              {exchange.direction === "inbound" ? "⬇️" : "⬆️"}{" "}
                              {exchange.direction}
                            </Badge>
                          )}
                        </div>
                        {exchange.subject && (
                          <p className="font-medium text-sm">
                            {exchange.subject}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {formatDate(exchange.created_at)}
                      </span>
                    </div>
                    {exchange.content && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {exchange.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documents suggérés */}
        <Card>
          <CardHeader>
            <CardTitle>Documents suggérés</CardTitle>
            <CardDescription>
              Documents utiles pour vos prospects
            </CardDescription>
          </CardHeader>
          <CardContent>
            {suggestedDocs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucun document disponible
              </p>
            ) : (
              <div className="space-y-3">
                {suggestedDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 border rounded-lg space-y-2 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <h4 className="font-medium text-sm">{doc.title}</h4>
                        {doc.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {doc.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {doc.filename} • {(doc.file_size / 1024).toFixed(0)}{" "}
                          KB
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Call-to-actions */}
      <Card>
        <CardContent className="flex items-center justify-center gap-4 py-8">
          <Button size="lg" asChild>
            <Link href="/prospects/new">+ Nouveau prospect</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/prospects">Voir tous les prospects</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
