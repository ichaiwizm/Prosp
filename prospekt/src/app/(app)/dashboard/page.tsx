"use client";

import { Header } from "@/components/layout/header";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { DashboardCommercial } from "@/components/features/dashboard/dashboard-commercial";
import { DashboardTech } from "@/components/features/dashboard/dashboard-tech";
import Link from "next/link";

export default function DashboardPage() {
  const { profile, loading } = useUser();

  // Show loading state
  if (loading) {
    return (
      <>
        <Header
          title="Dashboard"
          description="Vue d'ensemble de votre activité CRM"
        />
        <PageContainer>
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
        </PageContainer>
      </>
    );
  }

  // Show login prompt if no profile
  if (!profile) {
    return (
      <>
        <Header
          title="Dashboard"
          description="Vue d'ensemble de votre activité CRM"
        />
        <PageContainer>
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground mb-4">
                Veuillez vous connecter pour accéder au dashboard
              </p>
              <Button className="w-full" asChild>
                <Link href="/auth/login">Se connecter</Link>
              </Button>
            </CardContent>
          </Card>
        </PageContainer>
      </>
    );
  }

  // Determine dashboard description based on role
  const dashboardDescription =
    profile.role === "COMMERCIAL"
      ? "Vue commerciale - Gérez vos prospects et conversions"
      : "Vue technique - Gérez vos projets et développements";

  return (
    <>
      <Header
        title="Dashboard"
        description={dashboardDescription}
        actions={
          <Button asChild>
            <Link href="/prospects/new">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau prospect
            </Link>
          </Button>
        }
      />
      <PageContainer>
        <div className="space-y-6">
          {/* Welcome Card */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    Bienvenue, {profile.name || profile.email} !
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Rôle : <Badge variant="secondary">{profile.role}</Badge>
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role-based Dashboard */}
          {profile.role === "COMMERCIAL" && <DashboardCommercial />}
          {profile.role === "TECH" && <DashboardTech />}
        </div>
      </PageContainer>
    </>
  );
}
