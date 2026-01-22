import { Header } from '@/components/layout/header';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Save, Share2, Eye, Edit, Trash2 } from 'lucide-react';

/**
 * Page d'exemple montrant l'utilisation complète du système de layout Prospekt
 *
 * Cette page démontre:
 * - Header avec titre, description, breadcrumbs et actions multiples
 * - PageContainer avec max-width personnalisée
 * - Cards avec différents layouts
 * - Badges et boutons variés
 * - Espacement et hiérarchie visuelle
 */
export default function ExemplePage() {
  return (
    <>
      {/* Header avec toutes les options */}
      <Header
        title="Page d'exemple"
        description="Démonstration complète du système de layout"
        breadcrumbs={[
          { label: 'Accueil', href: '/dashboard' },
          { label: 'Exemples', href: '/exemple' },
          { label: 'Page complète' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {/* Actions secondaires */}
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Prévisualiser
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </Button>

            {/* Actions principales */}
            <Button size="sm">
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Créer
            </Button>
          </div>
        }
      />

      {/* Container avec max-width */}
      <PageContainer maxWidth="xl">
        <div className="space-y-8">
          {/* Section 1: Cards avec badges */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Cards avec badges</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Projet Alpha</CardTitle>
                    <Badge>Actif</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Description du projet avec détails importants.
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-1" />
                      Modifier
                    </Button>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Projet Beta</CardTitle>
                    <Badge variant="secondary">En pause</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Description du projet avec détails importants.
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-1" />
                      Modifier
                    </Button>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Projet Gamma</CardTitle>
                    <Badge>Nouveau</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Description du projet avec détails importants.
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-1" />
                      Modifier
                    </Button>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section 2: Card avec tableau */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Tableau de données</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between py-3 border-b last:border-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {item}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">Élément {item}</p>
                          <p className="text-sm text-muted-foreground">
                            Description de l'élément
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          Statut {item}
                        </Badge>
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 3: Grid layout */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Layout en grille</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Contenu principal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Cette section occupe 2/3 de la largeur sur les grands écrans.
                    </p>
                    <p className="text-muted-foreground">
                      Le layout s'adapte automatiquement sur mobile en prenant toute la largeur.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Sidebar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Cette section occupe 1/3 de la largeur.
                    </p>
                    <div className="mt-4 space-y-2">
                      <Button size="sm" className="w-full">
                        Action 1
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        Action 2
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </div>
      </PageContainer>
    </>
  );
}
