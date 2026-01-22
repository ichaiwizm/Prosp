'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { DealFormData, DealStage, DealStatus } from '@/types';

interface DealFormProps {
  initialData?: Partial<DealFormData>;
  onSubmit: (data: DealFormData) => void;
  onCancel?: () => void;
}

export function DealForm({ initialData, onSubmit, onCancel }: DealFormProps) {
  const [formData, setFormData] = useState<DealFormData>({
    title: initialData?.title || '',
    amount: initialData?.amount || 0,
    currency: initialData?.currency || 'USD',
    stage: initialData?.stage || 'prospecting',
    probability: initialData?.probability || 0,
    status: initialData?.status || 'open',
    notes: initialData?.notes || '',
    tags: initialData?.tags || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">Title *</label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium">Amount *</label>
        <Input
          id="amount"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="stage" className="text-sm font-medium">Stage</label>
        <Select
          value={formData.stage}
          onValueChange={(value: DealStage) => setFormData({ ...formData, stage: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="prospecting">Prospecting</SelectItem>
            <SelectItem value="qualification">Qualification</SelectItem>
            <SelectItem value="proposal">Proposal</SelectItem>
            <SelectItem value="negotiation">Negotiation</SelectItem>
            <SelectItem value="closed_won">Closed Won</SelectItem>
            <SelectItem value="closed_lost">Closed Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="probability" className="text-sm font-medium">Probability (%)</label>
        <Input
          id="probability"
          type="number"
          min="0"
          max="100"
          value={formData.probability}
          onChange={(e) => setFormData({ ...formData, probability: parseInt(e.target.value) })}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">Notes</label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
