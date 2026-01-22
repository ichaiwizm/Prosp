import { Header } from "@/components/layout/header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Filter, Calendar } from "lucide-react";

export default function TasksPage() {
  return (
    <>
      <Header
        title="Tâches"
        description="Gérez vos activités"
        breadcrumbs={[
          { label: "Accueil", href: "/dashboard" },
          { label: "Tâches" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Calendrier
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtrer
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </div>
        }
      />
      <PageContainer>
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <p className="text-lg mb-2">Aucune tâche pour le moment</p>
            <p className="text-sm">
              Commencez par ajouter votre première tâche
            </p>
          </div>
        </Card>
      </PageContainer>
    </>
  );
}
