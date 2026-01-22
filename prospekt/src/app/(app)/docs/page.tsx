"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { PageContainer } from "@/components/layout/page-container";
import { DocSearch } from "@/components/features/docs/doc-search";
import { DocCard } from "@/components/features/docs/doc-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { KnowledgeDoc, KnowledgeDocCategory } from "@/types";
import { BookOpen, Filter, X } from "lucide-react";

const categories: { value: KnowledgeDocCategory | "all"; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "SITUATION", label: "Situations" },
  { value: "SERVICE", label: "Services" },
  { value: "PROCESS", label: "Processus" },
  { value: "TEMPLATE", label: "Templates" },
];

export default function DocsPage() {
  const [docs, setDocs] = useState<KnowledgeDoc[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<KnowledgeDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    KnowledgeDocCategory | "all"
  >("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);

  // Fetch documents
  useEffect(() => {
    fetchDocs();
  }, []);

  // Filter documents based on search, category, and tag
  useEffect(() => {
    filterDocs();
  }, [docs, searchQuery, selectedCategory, selectedTag]);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (selectedCategory !== "all")
        params.append("category", selectedCategory);
      if (selectedTag) params.append("tag", selectedTag);

      const response = await fetch(`/api/knowledge-docs?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch documents");

      const data = await response.json();
      setDocs(data);

      // Extract all unique tags
      const tags = new Set<string>();
      data.forEach((doc: KnowledgeDoc) => {
        doc.tags?.forEach((tag) => tags.add(tag));
      });
      setAllTags(Array.from(tags).sort());
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterDocs = () => {
    let filtered = [...docs];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.title.toLowerCase().includes(query) ||
          doc.content.toLowerCase().includes(query),
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((doc) => doc.category === selectedCategory);
    }

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter((doc) => doc.tags?.includes(selectedTag));
    }

    setFilteredDocs(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category: KnowledgeDocCategory | "all") => {
    setSelectedCategory(category);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedTag(null);
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedCategory !== "all" || selectedTag !== null || searchQuery !== "";

  // Group docs by category for display
  const docsByCategory = filteredDocs.reduce(
    (acc, doc) => {
      if (!acc[doc.category]) {
        acc[doc.category] = [];
      }
      acc[doc.category].push(doc);
      return acc;
    },
    {} as Record<KnowledgeDocCategory, KnowledgeDoc[]>,
  );

  return (
    <>
      <Header
        title="Centre de Documentation"
        description="Consultez tous les documents, guides et templates pour mieux accompagner vos prospects"
        breadcrumbs={[
          { label: "Accueil", href: "/dashboard" },
          { label: "Documentation" },
        ]}
      />
      <PageContainer>
        <div className="space-y-6">
          {/* Search */}
          <Card className="p-6">
            <DocSearch onSearch={handleSearch} />
          </Card>

          {/* Filters */}
          <div className="space-y-4">
            {/* Category filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Categories:
              </span>
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  variant={
                    selectedCategory === cat.value ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleCategoryChange(cat.value)}
                >
                  {cat.label}
                </Button>
              ))}
            </div>

            {/* Tag filters */}
            {allTags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-muted-foreground">
                  Tags:
                </span>
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/90"
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Clear filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="gap-1"
              >
                <X className="h-3 w-3" />
                Effacer les filtres
              </Button>
            )}
          </div>

          {/* Results count */}
          <div className="text-sm text-muted-foreground">
            {filteredDocs.length} document{filteredDocs.length !== 1 ? "s" : ""}{" "}
            trouv{filteredDocs.length !== 1 ? "és" : "é"}
          </div>

          {/* Documents */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : filteredDocs.length === 0 ? (
            <EmptyState
              title="Aucun document trouvé"
              description={
                hasActiveFilters
                  ? "Essayez de modifier vos filtres de recherche"
                  : "Aucun document disponible pour le moment"
              }
              icon={<BookOpen className="h-12 w-12" />}
            />
          ) : (
            <div className="space-y-8">
              {selectedCategory === "all" ? (
                // Group by category
                Object.entries(docsByCategory).map(
                  ([category, categoryDocs]) => (
                    <div key={category} className="space-y-4">
                      <h2 className="text-xl font-semibold">
                        {categories.find((c) => c.value === category)?.label ||
                          category}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryDocs.map((doc) => (
                          <DocCard key={doc.id} doc={doc} />
                        ))}
                      </div>
                    </div>
                  ),
                )
              ) : (
                // Single list view
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDocs.map((doc) => (
                    <DocCard key={doc.id} doc={doc} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </PageContainer>
    </>
  );
}
