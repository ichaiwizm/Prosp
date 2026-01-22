"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { prospectsApi } from "@/lib/api-client";
import { toast } from "sonner";
import type { Prospect, CreateProspectRequest } from "@/types/database.types";

interface ProspectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  initialData?: Prospect;
}

export function ProspectForm({
  open,
  onOpenChange,
  onSuccess,
  initialData,
}: ProspectFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateProspectRequest>({
    company_name: initialData?.company_name || "",
    contact_name: initialData?.contact_name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    website: initialData?.website || "",
    status: initialData?.status || "lead",
    priority: initialData?.priority || "medium",
    potential_need: initialData?.potential_need || "",
    confirmed_need: initialData?.confirmed_need || "",
    source: initialData?.source || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (initialData) {
        await prospectsApi.update(initialData.id, formData);
        toast.success("Prospect mis \u00e0 jour avec succ\u00e8s");
      } else {
        await prospectsApi.create(formData);
        toast.success("Prospect cr\u00e9\u00e9 avec succ\u00e8s");
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error(
        initialData
          ? "Erreur lors de la mise \u00e0 jour du prospect"
          : "Erreur lors de la cr\u00e9ation du prospect",
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: keyof CreateProspectRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Modifier le prospect" : "Nouveau prospect"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="company_name" className="text-sm font-medium">
                Entreprise <span className="text-red-500">*</span>
              </label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => updateField("company_name", e.target.value)}
                required
                placeholder="Nom de l'entreprise"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="contact_name" className="text-sm font-medium">
                Contact <span className="text-red-500">*</span>
              </label>
              <Input
                id="contact_name"
                value={formData.contact_name}
                onChange={(e) => updateField("contact_name", e.target.value)}
                required
                placeholder="Nom du contact"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="email@exemple.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                T\u00e9l\u00e9phone
              </label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+33 6 12 34 56 78"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="website" className="text-sm font-medium">
              Site web
            </label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => updateField("website", e.target.value)}
              placeholder="https://exemple.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <Select
                value={formData.status}
                onValueChange={(value) => updateField("status", value)}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="contacted">Contact\u00e9</SelectItem>
                  <SelectItem value="qualified">Qualifi\u00e9</SelectItem>
                  <SelectItem value="proposal">Proposition</SelectItem>
                  <SelectItem value="negotiation">N\u00e9gociation</SelectItem>
                  <SelectItem value="won">Gagn\u00e9</SelectItem>
                  <SelectItem value="lost">Perdu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">
                Priorit\u00e9
              </label>
              <Select
                value={formData.priority}
                onValueChange={(value) => updateField("priority", value)}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Basse</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="source" className="text-sm font-medium">
              Source
            </label>
            <Input
              id="source"
              value={formData.source}
              onChange={(e) => updateField("source", e.target.value)}
              placeholder="Ex: LinkedIn, Site web, R\u00e9f\u00e9rence..."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="potential_need" className="text-sm font-medium">
              Besoin potentiel
            </label>
            <Textarea
              id="potential_need"
              value={formData.potential_need}
              onChange={(e) => updateField("potential_need", e.target.value)}
              placeholder="D\u00e9crivez le besoin potentiel du prospect..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmed_need" className="text-sm font-medium">
              Besoin confirm\u00e9
            </label>
            <Textarea
              id="confirmed_need"
              value={formData.confirmed_need}
              onChange={(e) => updateField("confirmed_need", e.target.value)}
              placeholder="D\u00e9crivez le besoin confirm\u00e9..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "En cours..."
                : initialData
                  ? "Mettre \u00e0 jour"
                  : "Cr\u00e9er"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
