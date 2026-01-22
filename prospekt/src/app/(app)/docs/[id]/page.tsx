'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { PageContainer } from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { MarkdownRenderer } from '@/components/features/docs/markdown-renderer';
import { KnowledgeDoc } from '@/types';
import { ArrowLeft, Calendar, Tag, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const categoryLabels: Record<string, string> = {
  SITUATION: 'Situation',
  SERVICE: 'Service',
  PROCESS: 'Processus',
  TEMPLATE: 'Template'
};

const categoryColors: Record<string, string> = {
  SITUATION: 'bg-blue-500/10 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-800',
  SERVICE: 'bg-green-500/10 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-800',
  PROCESS: 'bg-purple-500/10 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-800',
  TEMPLATE: 'bg-orange-500/10 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-800'
};

export default function DocDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [doc, setDoc] = useState<KnowledgeDoc | null>(null);
  const [relatedDocs, setRelatedDocs] = useState<KnowledgeDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchDoc(params.id as string);
    }
  }, [params.id]);

  const fetchDoc = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/knowledge-docs/${id}`);
      if (!response.ok) {
        throw new Error('Document not found');
      }

      const data = await response.json();
      setDoc(data);

      // Fetch related documents (same category or similar tags)
      await fetchRelatedDocs(data);
    } catch (err) {
      console.error('Error fetching document:', err);
      setError(err instanceof Error ? err.message : 'Failed to load document');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedDocs = async (currentDoc: KnowledgeDoc) => {
    try {
      // Fetch documents from the same category
      const response = await fetch(`/api/knowledge-docs?category=${currentDoc.category}`);
      if (response.ok) {
        const data = await response.json();
        // Filter out current doc and limit to 3 related docs
        const related = data
          .filter((d: KnowledgeDoc) => d.id !== currentDoc.id)
          .slice(0, 3);
        setRelatedDocs(related);
      }
    } catch (err) {
      console.error('Error fetching related docs:', err);
    }
  };

  if (loading) {
    return (
      <>
        <Header
          title="Chargement..."
          breadcrumbs={[
            { label: 'Accueil', href: '/dashboard' },
            { label: 'Documentation', href: '/docs' },
            { label: 'Document' },
          ]}
        />
        <PageContainer>
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        </PageContainer>
      </>
    );
  }

  if (error || !doc) {
    return (
      <>
        <Header
          title="Document introuvable"
          breadcrumbs={[
            { label: 'Accueil', href: '/dashboard' },
            { label: 'Documentation', href: '/docs' },
            { label: 'Erreur' },
          ]}
        />
        <PageContainer>
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Document introuvable</h2>
            <p className="text-muted-foreground mb-6">
              Le document que vous recherchez n'existe pas ou a été supprimé.
            </p>
            <Button onClick={() => router.push('/docs')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux documents
            </Button>
          </div>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Header
        title={doc.title}
        breadcrumbs={[
          { label: 'Accueil', href: '/dashboard' },
          { label: 'Documentation', href: '/docs' },
          { label: doc.title },
        ]}
        actions={
          <Button
            variant="ghost"
            onClick={() => router.push('/docs')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        }
      />
      <PageContainer maxWidth="lg">
        <div className="space-y-6">
          {/* Document metadata */}
          <div className="flex items-center gap-3 flex-wrap">
            <Badge
              variant="outline"
              className={categoryColors[doc.category] || ''}
            >
              {categoryLabels[doc.category] || doc.category}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Mis à jour le {format(new Date(doc.updated_at), 'dd MMMM yyyy', { locale: fr })}
              </span>
            </div>
          </div>

          {/* Tags */}
          {doc.tags && doc.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {doc.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Document content */}
          <Card>
            <CardContent className="pt-6">
              <MarkdownRenderer content={doc.content} />
            </CardContent>
          </Card>

          {/* Related documents */}
          {relatedDocs.length > 0 && (
            <div className="space-y-4 pt-8 border-t">
              <h2 className="text-2xl font-semibold">Documents similaires</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedDocs.map((relatedDoc) => (
                  <Card
                    key={relatedDoc.id}
                    className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50"
                    onClick={() => router.push(`/docs/${relatedDoc.id}`)}
                  >
                    <CardContent className="pt-6">
                      <Badge
                        variant="outline"
                        className={categoryColors[relatedDoc.category] || ''}
                      >
                        {categoryLabels[relatedDoc.category] || relatedDoc.category}
                      </Badge>
                      <h3 className="font-semibold mt-3 line-clamp-2">{relatedDoc.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {relatedDoc.content.substring(0, 100)}...
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </PageContainer>
    </>
  );
}
