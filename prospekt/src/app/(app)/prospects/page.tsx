'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/features/prospects/status-badge';
import { PriorityBadge } from '@/components/features/prospects/priority-badge';
import { ProspectForm } from '@/components/features/prospects/prospect-form';
import { Pagination } from '@/components/shared/Pagination';
import { prospectsApi } from '@/lib/api-client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus, Search, ArrowUpDown, Mail, Phone, ExternalLink } from 'lucide-react';
import type { Prospect } from '@/types/database.types';

type SortField = 'company_name' | 'contact_name' | 'status' | 'priority' | 'last_exchange';
type SortDirection = 'asc' | 'desc';

export default function ProspectsPage() {
  const router = useRouter();
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Tri
  const [sortField, setSortField] = useState<SortField>('company_name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    loadProspects();
  }, []);

  const loadProspects = async () => {
    try {
      setIsLoading(true);
      const data = await prospectsApi.list();
      setProspects(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des prospects');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrage et tri
  const filteredAndSortedProspects = useMemo(() => {
    let filtered = [...prospects];

    // Recherche textuelle
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.company_name?.toLowerCase().includes(query) ||
          p.contact_name?.toLowerCase().includes(query) ||
          p.email?.toLowerCase().includes(query)
      );
    }

    // Filtre status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // Filtre priority
    if (priorityFilter !== 'all') {
      filtered = filtered.filter((p) => p.priority === priorityFilter);
    }

    // Tri
    filtered.sort((a, b) => {
      let aValue: string | number | undefined;
      let bValue: string | number | undefined;

      switch (sortField) {
        case 'company_name':
          aValue = a.company_name?.toLowerCase() || '';
          bValue = b.company_name?.toLowerCase() || '';
          break;
        case 'contact_name':
          aValue = a.contact_name?.toLowerCase() || '';
          bValue = b.contact_name?.toLowerCase() || '';
          break;
        case 'status':
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
          break;
        case 'last_exchange':
          aValue = a.last_exchange || '';
          bValue = b.last_exchange || '';
          break;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [prospects, searchQuery, statusFilter, priorityFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProspects.length / itemsPerPage);
  const paginatedProspects = filteredAndSortedProspects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRowClick = (prospectId: string) => {
    router.push(`/prospects/${prospectId}`);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Prospects</h1>
          <p className="text-muted-foreground">Gérez vos leads et contacts</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="size-4" />
          Nouveau prospect
        </Button>
      </div>

      {/* Filtres */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par entreprise, contact, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="contacted">Contacté</SelectItem>
              <SelectItem value="qualified">Qualifié</SelectItem>
              <SelectItem value="proposal">Proposition</SelectItem>
              <SelectItem value="negotiation">Négociation</SelectItem>
              <SelectItem value="won">Gagné</SelectItem>
              <SelectItem value="lost">Perdu</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les priorités" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les priorités</SelectItem>
              <SelectItem value="urgent">Urgente</SelectItem>
              <SelectItem value="high">Haute</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="low">Basse</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Tableau */}
      <Card>
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block size-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
            <p className="mt-4 text-muted-foreground">Chargement...</p>
          </div>
        ) : paginatedProspects.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'Aucun prospect ne correspond à vos filtres'
              : 'Aucun prospect pour le moment'}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium">
                      <button
                        onClick={() => handleSort('company_name')}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        Entreprise
                        <ArrowUpDown className="size-4" />
                      </button>
                    </th>
                    <th className="text-left p-4 font-medium">
                      <button
                        onClick={() => handleSort('contact_name')}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        Contact
                        <ArrowUpDown className="size-4" />
                      </button>
                    </th>
                    <th className="text-left p-4 font-medium">
                      <button
                        onClick={() => handleSort('status')}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        Status
                        <ArrowUpDown className="size-4" />
                      </button>
                    </th>
                    <th className="text-left p-4 font-medium">
                      <button
                        onClick={() => handleSort('priority')}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        Priorité
                        <ArrowUpDown className="size-4" />
                      </button>
                    </th>
                    <th className="text-left p-4 font-medium">
                      <button
                        onClick={() => handleSort('last_exchange')}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        Dernier échange
                        <ArrowUpDown className="size-4" />
                      </button>
                    </th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProspects.map((prospect) => (
                    <tr
                      key={prospect.id}
                      onClick={() => handleRowClick(prospect.id)}
                      className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-medium">{prospect.company_name}</div>
                        {prospect.website && (
                          <a
                            href={prospect.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                          >
                            {new URL(prospect.website).hostname}
                            <ExternalLink className="size-3" />
                          </a>
                        )}
                      </td>
                      <td className="p-4">
                        <div>{prospect.contact_name}</div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          {prospect.email && (
                            <a
                              href={`mailto:${prospect.email}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 hover:text-primary"
                            >
                              <Mail className="size-3" />
                              {prospect.email}
                            </a>
                          )}
                          {prospect.phone && (
                            <a
                              href={`tel:${prospect.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 hover:text-primary"
                            >
                              <Phone className="size-3" />
                              {prospect.phone}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={prospect.status} />
                      </td>
                      <td className="p-4">
                        <PriorityBadge priority={prospect.priority} />
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {prospect.last_exchange
                          ? format(new Date(prospect.last_exchange), 'dd MMM yyyy', { locale: fr })
                          : 'Jamais'}
                      </td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(prospect.id);
                          }}
                        >
                          Voir détails
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t p-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredAndSortedProspects.length}
                />
              </div>
            )}
          </>
        )}
      </Card>

      {/* Modal formulaire */}
      <ProspectForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={loadProspects}
      />
    </div>
  );
}
