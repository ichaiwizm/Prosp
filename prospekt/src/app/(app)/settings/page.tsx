import { Header } from '@/components/layout/header';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <>
      <Header
        title="Paramètres"
        description="Gérez vos préférences de compte"
        breadcrumbs={[
          { label: 'Accueil', href: '/dashboard' },
          { label: 'Paramètres' },
        ]}
      />
      <PageContainer maxWidth="lg">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profil</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Les paramètres de profil seront disponibles prochainement.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Les paramètres de notification seront disponibles prochainement.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Les paramètres de sécurité seront disponibles prochainement.
              </p>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </>
  );
}
