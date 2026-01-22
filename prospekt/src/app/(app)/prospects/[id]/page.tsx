"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/features/prospects/status-badge";
import { PriorityBadge } from "@/components/features/prospects/priority-badge";
import { ProspectForm } from "@/components/features/prospects/prospect-form";
import { ExchangeList } from "@/components/features/exchanges/exchange-list";
import { NotesList } from "@/components/features/notes/notes-list";
import { AssistantPanel } from "@/components/features/assistant/assistant-panel";
import { prospectsApi } from "@/lib/api-client";
import { toast } from "sonner";
import {
  ArrowLeft,
  Mail,
  Phone,
  ExternalLink,
  Edit2,
  Bot,
  Building2,
  User,
} from "lucide-react";
import type { Prospect } from "@/types/database.types";

interface ProspectDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProspectDetailPage({
  params,
}: ProspectDetailPageProps) {
  const router = useRouter();
  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isPriorityDialogOpen, setIsPriorityDialogOpen] = useState(false);
  const [isNeedDialogOpen, setIsNeedDialogOpen] = useState(false);
  const [isAssistantDialogOpen, setIsAssistantDialogOpen] = useState(false);

  const [editingField, setEditingField] = useState<
    "potential_need" | "confirmed_need"
  >("potential_need");
  const [needContent, setNeedContent] = useState("");

  useEffect(() => {
    loadProspect();
  }, [params.id]);

  const loadProspect = async () => {
    try {
      setIsLoading(true);
      const data = await prospectsApi.get(params.id);
      setProspect(data);
    } catch (error) {
      toast.error("Erreur lors du chargement du prospect");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: Prospect["status"]) => {
    if (!prospect) return;

    try {
      await prospectsApi.update(prospect.id, { status: newStatus });
      toast.success("Status mis à jour");
      setIsStatusDialogOpen(false);
      loadProspect();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
      console.error(error);
    }
  };

  const handleUpdatePriority = async (newPriority: Prospect["priority"]) => {
    if (!prospect) return;

    try {
      await prospectsApi.update(prospect.id, { priority: newPriority });
      toast.success("Priorité mise à jour");
      setIsPriorityDialogOpen(false);
      loadProspect();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
      console.error(error);
    }
  };

  const handleUpdateNeed = async () => {
    if (!prospect) return;

    try {
      const updateData =
        editingField === "potential_need"
          ? { potential_need: needContent }
          : { confirmed_need: needContent };

      await prospectsApi.update(prospect.id, updateData);
      toast.success("Besoin mis à jour");
      setIsNeedDialogOpen(false);
      loadProspect();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
      console.error(error);
    }
  };

  const openNeedDialog = (field: "potential_need" | "confirmed_need") => {
    setEditingField(field);
    setNeedContent(prospect?.[field] || "");
    setIsNeedDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block size-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
      </div>
    );
  }

  if (!prospect) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Prospect introuvable</h2>
          <Button onClick={() => router.push("/prospects")}>
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/prospects")}
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{prospect.company_name}</h1>
            <p className="text-muted-foreground">{prospect.contact_name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsAssistantDialogOpen(true)}
          >
            <Bot className="size-4" />
            Assistant IA
          </Button>
          <Button variant="outline" onClick={() => setIsEditFormOpen(true)}>
            <Edit2 className="size-4" />
            Modifier
          </Button>
        </div>
      </div>

      {/* Informations principales */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="size-4" />
              <span>Entreprise</span>
            </div>
            <div>
              <div className="font-medium text-lg">{prospect.company_name}</div>
              {prospect.website && (
                <a
                  href={prospect.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                >
                  {new URL(prospect.website).hostname}
                  <ExternalLink className="size-3" />
                </a>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="size-4" />
              <span>Contact</span>
            </div>
            <div className="space-y-2">
              <div className="font-medium">{prospect.contact_name}</div>
              {prospect.email && (
                <a
                  href={`mailto:${prospect.email}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                >
                  <Mail className="size-4" />
                  {prospect.email}
                </a>
              )}
              {prospect.phone && (
                <a
                  href={`tel:${prospect.phone}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                >
                  <Phone className="size-4" />
                  {prospect.phone}
                </a>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">État</div>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Status</div>
                <button onClick={() => setIsStatusDialogOpen(true)}>
                  <StatusBadge status={prospect.status} />
                </button>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  Priorité
                </div>
                <button onClick={() => setIsPriorityDialogOpen(true)}>
                  <PriorityBadge priority={prospect.priority} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Besoins */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Besoin potentiel</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openNeedDialog("potential_need")}
            >
              <Edit2 className="size-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {prospect.potential_need || "Aucun besoin potentiel défini"}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Besoin confirmé</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openNeedDialog("confirmed_need")}
            >
              <Edit2 className="size-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {prospect.confirmed_need || "Aucun besoin confirmé"}
          </p>
        </Card>
      </div>

      {/* Tabs: Échanges et Notes */}
      <Tabs defaultValue="exchanges" className="space-y-4">
        <TabsList>
          <TabsTrigger value="exchanges">Échanges</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="exchanges">
          <ExchangeList prospectId={prospect.id} />
        </TabsContent>

        <TabsContent value="notes">
          <NotesList prospectId={prospect.id} />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <ProspectForm
        open={isEditFormOpen}
        onOpenChange={setIsEditFormOpen}
        onSuccess={loadProspect}
        initialData={prospect}
      />

      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le status</DialogTitle>
          </DialogHeader>
          <Select
            value={prospect.status}
            onValueChange={(value) =>
              handleUpdateStatus(value as Prospect["status"])
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="contacted">Contacté</SelectItem>
              <SelectItem value="qualified">Qualifié</SelectItem>
              <SelectItem value="proposal">Proposition</SelectItem>
              <SelectItem value="negotiation">Négociation</SelectItem>
              <SelectItem value="won">Gagné</SelectItem>
              <SelectItem value="lost">Perdu</SelectItem>
            </SelectContent>
          </Select>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isPriorityDialogOpen}
        onOpenChange={setIsPriorityDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la priorité</DialogTitle>
          </DialogHeader>
          <Select
            value={prospect.priority}
            onValueChange={(value) =>
              handleUpdatePriority(value as Prospect["priority"])
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Basse</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="high">Haute</SelectItem>
              <SelectItem value="urgent">Urgente</SelectItem>
            </SelectContent>
          </Select>
        </DialogContent>
      </Dialog>

      <Dialog open={isNeedDialogOpen} onOpenChange={setIsNeedDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingField === "potential_need"
                ? "Besoin potentiel"
                : "Besoin confirmé"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={needContent}
              onChange={(e) => setNeedContent(e.target.value)}
              placeholder="Décrivez le besoin..."
              rows={6}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNeedDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleUpdateNeed}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assistant IA */}
      {isAssistantDialogOpen && (
        <AssistantPanel
          context={{
            prospectId: prospect.id,
            prospect: {
              id: prospect.id,
              company_name: prospect.company_name,
              contact_name: prospect.contact_name,
              email: prospect.email || "",
              phone: prospect.phone || "",
              website: prospect.website,
              status: prospect.status,
              priority: prospect.priority,
              potential_need: prospect.potential_need,
              confirmed_need: prospect.confirmed_need,
              last_exchange: prospect.last_exchange,
              source: prospect.source,
              tags: prospect.tags,
              created_at: prospect.created_at || "",
              updated_at: prospect.updated_at || "",
            },
          }}
          onClose={() => setIsAssistantDialogOpen(false)}
        />
      )}
    </div>
  );
}
