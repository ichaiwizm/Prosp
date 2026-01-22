'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { notesApi } from '@/lib/api-client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus, Pin, Trash2 } from 'lucide-react';
import type { Note, CreateNoteRequest } from '@/types/database.types';

interface NotesListProps {
  prospectId: string;
}

const noteTypeLabels = {
  general: 'G\u00e9n\u00e9rale',
  call: 'Appel',
  meeting: 'R\u00e9union',
  reminder: 'Rappel',
  followup: 'Suivi',
};

const noteTypeColors = {
  general: 'bg-gray-100 text-gray-700',
  call: 'bg-blue-100 text-blue-700',
  meeting: 'bg-green-100 text-green-700',
  reminder: 'bg-yellow-100 text-yellow-700',
  followup: 'bg-purple-100 text-purple-700',
};

export function NotesList({ prospectId }: NotesListProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateNoteRequest>({
    prospect_id: prospectId,
    content: '',
    type: 'general',
    is_pinned: false,
  });

  useEffect(() => {
    loadNotes();
  }, [prospectId]);

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      const data = await notesApi.listByProspect(prospectId);
      setNotes(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des notes');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await notesApi.create(formData);
      toast.success('Note ajout\u00e9e avec succ\u00e8s');
      setIsDialogOpen(false);
      setFormData({
        prospect_id: prospectId,
        content: '',
        type: 'general',
        is_pinned: false,
      });
      loadNotes();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de la note');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePin = async (note: Note) => {
    try {
      await notesApi.update(note.id, { is_pinned: !note.is_pinned });
      toast.success(note.is_pinned ? 'Note d\u00e9s\u00e9pingl\u00e9e' : 'Note \u00e9pingl\u00e9e');
      loadNotes();
    } catch (error) {
      toast.error('Erreur lors de la mise \u00e0 jour');
      console.error(error);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (!confirm('\u00cates-vous s\u00fbr de vouloir supprimer cette note ?')) {
      return;
    }

    try {
      await notesApi.delete(noteId);
      toast.success('Note supprim\u00e9e avec succ\u00e8s');
      loadNotes();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-24 bg-muted animate-pulse rounded-lg" />
        <div className="h-24 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  const pinnedNotes = notes.filter((note) => note.is_pinned);
  const regularNotes = notes.filter((note) => !note.is_pinned);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Notes</h3>
        <Button onClick={() => setIsDialogOpen(true)} size="sm">
          <Plus className="size-4" />
          Nouvelle note
        </Button>
      </div>

      {notes.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          Aucune note enregistr\u00e9e
        </Card>
      ) : (
        <div className="space-y-4">
          {pinnedNotes.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Pin className="size-4" />
                Notes \u00e9pingl\u00e9es
              </h4>
              {pinnedNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onTogglePin={handleTogglePin}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {regularNotes.length > 0 && (
            <div className="space-y-2">
              {pinnedNotes.length > 0 && (
                <h4 className="text-sm font-medium text-muted-foreground">Autres notes</h4>
              )}
              {regularNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onTogglePin={handleTogglePin}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle note</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-medium">
                  Type
                </label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, type: value as Note['type'] }))
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">G\u00e9n\u00e9rale</SelectItem>
                    <SelectItem value="call">Appel</SelectItem>
                    <SelectItem value="meeting">R\u00e9union</SelectItem>
                    <SelectItem value="reminder">Rappel</SelectItem>
                    <SelectItem value="followup">Suivi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Options</label>
                <div className="flex items-center gap-2 h-9">
                  <input
                    type="checkbox"
                    id="is_pinned"
                    checked={formData.is_pinned}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, is_pinned: e.target.checked }))
                    }
                    className="size-4 rounded border-gray-300"
                  />
                  <label htmlFor="is_pinned" className="text-sm cursor-pointer">
                    \u00c9pingler cette note
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Contenu <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="\u00c9crivez votre note..."
                rows={6}
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Ajout...' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NoteCard({
  note,
  onTogglePin,
  onDelete,
}: {
  note: Note;
  onTogglePin: (note: Note) => void;
  onDelete: (id: string) => void;
}) {
  const typeLabel = note.type ? noteTypeLabels[note.type] : 'G\u00e9n\u00e9rale';
  const typeColor = note.type ? noteTypeColors[note.type] : noteTypeColors.general;

  return (
    <Card className={`p-4 ${note.is_pinned ? 'border-yellow-300 bg-yellow-50/50' : ''}`}>
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={typeColor}>{typeLabel}</Badge>
            {note.created_at && (
              <span className="text-xs text-muted-foreground">
                {format(new Date(note.created_at), 'PPP', { locale: fr })}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onTogglePin(note)}
              className={note.is_pinned ? 'text-yellow-600' : ''}
            >
              <Pin className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onDelete(note.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm whitespace-pre-wrap">{note.content}</p>
      </div>
    </Card>
  );
}
