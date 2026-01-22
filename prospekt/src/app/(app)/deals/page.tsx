import { Header } from '@/components/layout/header';
import { PageContainer } from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Filter, LayoutGrid } from 'lucide-react';

export default function DealsPage() {
  return (
    <>
      <Header
        title="Deals"
        description="Suivez votre pipeline de ventes"
        breadcrumbs={[
          { label: 'Accueil', href: '/dashboard' },
          { label: 'Deals' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtrer
            </Button>
            <Button variant="outline" size="sm">
              <LayoutGrid className="w-4 h-4 mr-2" />
              Vue
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
            <p className="text-lg mb-2">Aucun deal pour le moment</p>
            <p className="text-sm">Commencez par ajouter votre premier deal</p>
          </div>
        </Card>
      </PageContainer>
    </>
  );
}
