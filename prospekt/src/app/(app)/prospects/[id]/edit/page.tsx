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
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Prospect } from "@/types";

// Status options with French labels
const STATUS_OPTIONS = [
  { value: "NEW", label: "Nouveau" },
  { value: "TO_CONTACT", label: "A contacter" },
  { value: "IN_DISCUSSION", label: "En discussion" },
  { value: "NEED_CONFIRMED", label: "Besoin confirme" },
  { value: "IN_PROGRESS", label: "En cours" },
  { value: "WON", label: "Gagne" },
  { value: "LOST", label: "Perdu" },
  { value: "ON_HOLD", label: "En pause" },
];

// Priority options with French labels
const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Basse" },
  { value: "MEDIUM", label: "Moyenne" },
  { value: "HIGH", label: "Haute" },
  { value: "URGENT", label: "Urgente" },
];

interface FormData {
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  website: string;
  status: string;
  priority: string;
  source: string;
  potential_need: string;
  confirmed_need: string;
  tags: string;
}

export default function EditProspectPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    website: "",
    status: "NEW",
    priority: "MEDIUM",
    source: "",
    potential_need: "",
    confirmed_need: "",
    tags: "",
  });

  useEffect(() => {
    async function fetchProspect() {
      try {
        const res = await fetch(`/api/prospects/${id}`);
        if (!res.ok) throw new Error("Impossible de charger le prospect");
        const prospect: Prospect = await res.json();

        setFormData({
          company_name: prospect.company_name || "",
          contact_name: prospect.contact_name || "",
          email: prospect.email || "",
          phone: prospect.phone || "",
          website: prospect.website || "",
          status: prospect.status?.toUpperCase() || "NEW",
          priority: prospect.priority?.toUpperCase() || "MEDIUM",
          source: prospect.source || "",
          potential_need: prospect.potential_need || "",
          confirmed_need: prospect.confirmed_need || "",
          tags: prospect.tags?.join(", ") || "",
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProspect();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      // Parse tags from comma-separated string
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const payload = {
        company_name: formData.company_name,
        contact_name: formData.contact_name || null,
        email: formData.email || null,
        phone: formData.phone || null,
        website: formData.website || null,
        status: formData.status.toUpperCase(),
        priority: formData.priority.toUpperCase(),
        source: formData.source || null,
        potential_need: formData.potential_need || null,
        confirmed_need: formData.confirmed_need || null,
        tags: tagsArray.length > 0 ? tagsArray : null,
      };

      const res = await fetch(`/api/prospects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error || "Impossible de sauvegarder les modifications"
        );
      }

      router.push(`/prospects/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4 max-w-3xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error && !formData.company_name) {
    return (
      <div className="p-8">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              <p className="text-lg font-semibold">Erreur</p>
              <p>{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push("/prospects")}
              >
                Retour a la liste
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/prospects/${id}`}>
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
        <h1 className="text-2xl font-bold">Modifier le prospect</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informations du prospect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Company Name - Required */}
            <div className="space-y-2">
              <label
                htmlFor="company_name"
                className="text-sm font-medium text-foreground"
              >
                Nom de l&apos;entreprise <span className="text-red-500">*</span>
              </label>
              <Input
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
                placeholder="Nom de l'entreprise"
              />
            </div>

            {/* Contact Name */}
            <div className="space-y-2">
              <label
                htmlFor="contact_name"
                className="text-sm font-medium text-foreground"
              >
                Nom du contact
              </label>
              <Input
                id="contact_name"
                name="contact_name"
                value={formData.contact_name}
                onChange={handleChange}
                placeholder="Prenom Nom"
              />
            </div>

            {/* Email and Phone - Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@entreprise.com"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-foreground"
                >
                  Telephone
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
            </div>

            {/* Website */}
            <div className="space-y-2">
              <label
                htmlFor="website"
                className="text-sm font-medium text-foreground"
              >
                Site web
              </label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://www.entreprise.com"
              />
            </div>

            {/* Status and Priority - Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="status"
                  className="text-sm font-medium text-foreground"
                >
                  Statut
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="priority"
                  className="text-sm font-medium text-foreground"
                >
                  Priorite
                </label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    handleSelectChange("priority", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selectionner une priorite" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Source */}
            <div className="space-y-2">
              <label
                htmlFor="source"
                className="text-sm font-medium text-foreground"
              >
                Source
              </label>
              <Input
                id="source"
                name="source"
                value={formData.source}
                onChange={handleChange}
                placeholder="Ex: LinkedIn, Site web, Recommandation..."
              />
            </div>

            {/* Potential Need */}
            <div className="space-y-2">
              <label
                htmlFor="potential_need"
                className="text-sm font-medium text-foreground"
              >
                Besoin potentiel
              </label>
              <Textarea
                id="potential_need"
                name="potential_need"
                value={formData.potential_need}
                onChange={handleChange}
                placeholder="Decrivez le besoin potentiel identifie..."
                rows={3}
              />
            </div>

            {/* Confirmed Need */}
            <div className="space-y-2">
              <label
                htmlFor="confirmed_need"
                className="text-sm font-medium text-foreground"
              >
                Besoin confirme
              </label>
              <Textarea
                id="confirmed_need"
                name="confirmed_need"
                value={formData.confirmed_need}
                onChange={handleChange}
                placeholder="Decrivez le besoin confirme avec le prospect..."
                rows={3}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label
                htmlFor="tags"
                className="text-sm font-medium text-foreground"
              >
                Tags
              </label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Tag1, Tag2, Tag3 (separes par des virgules)"
              />
              <p className="text-xs text-muted-foreground">
                Separez les tags par des virgules
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/prospects/${id}`)}
              disabled={saving}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
