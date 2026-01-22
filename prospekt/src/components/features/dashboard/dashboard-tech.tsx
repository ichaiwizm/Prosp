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
import { Prospect } from "@/types/database.types";

interface DashboardStats {
  projectsInProgress: number;
  needsConfirmed: number;
  pipelineRevenue: number;
}

interface ProjectProspect extends Prospect {
  estimatedRevenue?: number;
  deadline?: string;
  techStack?: string[];
}

export function DashboardTech() {
  const [stats, setStats] = useState<DashboardStats>({
    projectsInProgress: 0,
    needsConfirmed: 0,
    pipelineRevenue: 0,
  });
  const [confirmedProspects, setConfirmedProspects] = useState<
    ProjectProspect[]
  >([]);
  const [projectsInProgress, setProjectsInProgress] = useState<
    ProjectProspect[]
  >([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<ProjectProspect[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch prospects
        const prospectsRes = await fetch("/api/prospects");
        const prospects: Prospect[] = await prospectsRes.json();

        // Calculate stats
        const inProgress = prospects.filter(
          (p) => p.status === "negotiation",
        ).length;
        const confirmed = prospects.filter(
          (p) => p.status === "qualified",
        ).length;

        // Pipeline revenue calculation (simplified - would need actual deal amounts)
        const pipelineRevenue =
          prospects.filter(
            (p) =>
              p.status === "qualified" ||
              p.status === "negotiation" ||
              p.status === "proposal",
          ).length * 5000; // Estimation simple

        setStats({
          projectsInProgress: inProgress,
          needsConfirmed: confirmed,
          pipelineRevenue,
        });

        // Get confirmed prospects (ready for dev)
        const confirmedList = prospects
          .filter((p) => p.status === "qualified")
          .slice(0, 5)
          .map((p) => ({
            ...p,
            estimatedRevenue: Math.floor(Math.random() * 20000) + 5000,
            techStack: ["React", "Node.js", "PostgreSQL"].slice(
              0,
              Math.floor(Math.random() * 3) + 1,
            ),
          }));
        setConfirmedProspects(confirmedList);

        // Get projects in progress
        const inProgressList = prospects
          .filter((p) => p.status === "negotiation")
          .slice(0, 5)
          .map((p) => ({
            ...p,
            estimatedRevenue: Math.floor(Math.random() * 20000) + 5000,
            techStack: ["React", "Node.js", "PostgreSQL"].slice(
              0,
              Math.floor(Math.random() * 3) + 1,
            ),
          }));
        setProjectsInProgress(inProgressList);

        // Get upcoming deadlines (simplified)
        const deadlinesList = prospects
          .filter((p) => p.status === "negotiation" || p.status === "proposal")
          .slice(0, 5)
          .map((p) => {
            const deadline = new Date();
            deadline.setDate(
              deadline.getDate() + Math.floor(Math.random() * 30) + 1,
            );
            return {
              ...p,
              deadline: deadline.toISOString(),
              estimatedRevenue: Math.floor(Math.random() * 20000) + 5000,
            };
          })
          .sort(
            (a, b) =>
              new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime(),
          );
        setUpcomingDeadlines(deadlinesList);
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
      qualified: "default",
      proposal: "outline",
      negotiation: "outline",
      won: "default",
      lost: "destructive",
    };
    const labels: Record<string, string> = {
      qualified: "Besoin confirmé",
      negotiation: "En cours",
      proposal: "Proposition",
      won: "Terminé",
    };
    return (
      <Badge variant={variants[status || "lead"] || "default"}>
        {labels[status || "lead"] || status || "lead"}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysUntil = (date?: string) => {
    if (!date) return null;
    const now = new Date();
    const target = new Date(date);
    const diff = Math.ceil(
      (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff;
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
              Projets en cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.projectsInProgress}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Développement actif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Besoins confirmés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.needsConfirmed}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Prêts à développer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pipeline Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(stats.pipelineRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Revenus potentiels
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Prospects avec besoin confirmé */}
      <Card>
        <CardHeader>
          <CardTitle>Prospects avec besoin confirmé</CardTitle>
          <CardDescription>Prêts à démarrer le développement</CardDescription>
        </CardHeader>
        <CardContent>
          {confirmedProspects.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Aucun prospect avec besoin confirmé
            </p>
          ) : (
            <div className="space-y-4">
              {confirmedProspects.map((prospect) => (
                <div
                  key={prospect.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{prospect.contact_name}</h4>
                      {getStatusBadge(prospect.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {prospect.company_name && (
                        <span>{prospect.company_name}</span>
                      )}
                      {prospect.estimatedRevenue && (
                        <span className="font-medium text-foreground">
                          {formatCurrency(prospect.estimatedRevenue)}
                        </span>
                      )}
                    </div>
                    {prospect.techStack && prospect.techStack.length > 0 && (
                      <div className="flex gap-2">
                        {prospect.techStack.map((tech, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/prospects/${prospect.id}`}>Détails</Link>
                    </Button>
                    <Button size="sm">Démarrer</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projets en cours */}
        <Card>
          <CardHeader>
            <CardTitle>Projets en cours</CardTitle>
            <CardDescription>Développement actif</CardDescription>
          </CardHeader>
          <CardContent>
            {projectsInProgress.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucun projet en cours
              </p>
            ) : (
              <div className="space-y-3">
                {projectsInProgress.map((project) => (
                  <div
                    key={project.id}
                    className="p-3 border rounded-lg space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">
                            {project.contact_name}
                          </h4>
                          {getStatusBadge(project.status)}
                        </div>
                        {project.company_name && (
                          <p className="text-xs text-muted-foreground">
                            {project.company_name}
                          </p>
                        )}
                        {project.estimatedRevenue && (
                          <p className="text-sm font-medium">
                            {formatCurrency(project.estimatedRevenue)}
                          </p>
                        )}
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/prospects/${project.id}`}>Voir</Link>
                      </Button>
                    </div>
                    {project.techStack && project.techStack.length > 0 && (
                      <div className="flex gap-1">
                        {project.techStack.map((tech, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timeline des deadlines */}
        <Card>
          <CardHeader>
            <CardTitle>Prochaines deadlines</CardTitle>
            <CardDescription>Échéances à venir</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingDeadlines.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucune deadline à venir
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingDeadlines.map((item) => {
                  const daysUntil = getDaysUntil(item.deadline);
                  const isUrgent = daysUntil !== null && daysUntil <= 7;

                  return (
                    <div
                      key={item.id}
                      className={`p-3 border rounded-lg space-y-2 ${
                        isUrgent ? "border-red-300 bg-red-50" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <h4 className="font-medium text-sm">
                            {item.contact_name}
                          </h4>
                          {item.company_name && (
                            <p className="text-xs text-muted-foreground">
                              {item.company_name}
                            </p>
                          )}
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={isUrgent ? "destructive" : "outline"}
                              className="text-xs"
                            >
                              {daysUntil !== null
                                ? daysUntil === 0
                                  ? "Aujourd'hui"
                                  : daysUntil === 1
                                    ? "Demain"
                                    : `Dans ${daysUntil} jours`
                                : "N/A"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(item.deadline)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Call-to-action */}
      <Card>
        <CardContent className="flex items-center justify-center gap-4 py-8">
          <Button size="lg" asChild>
            <Link href="/prospects?status=qualified">
              Voir tous les besoins confirmés
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/prospects">Tous les prospects</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
