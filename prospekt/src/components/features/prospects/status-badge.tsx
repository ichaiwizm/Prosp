import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ProspectStatus =
  | "NEW"
  | "TO_CONTACT"
  | "IN_DISCUSSION"
  | "NEED_CONFIRMED"
  | "IN_PROGRESS"
  | "WON"
  | "LOST"
  | "ON_HOLD"
  // Legacy lowercase values for backwards compatibility
  | "lead"
  | "contacted"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  // New uppercase statuses
  NEW: {
    label: "Nouveau",
    className: "bg-gray-100 text-gray-800 border-gray-200",
  },
  TO_CONTACT: {
    label: "À contacter",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  IN_DISCUSSION: {
    label: "En discussion",
    className: "bg-purple-100 text-purple-800 border-purple-200",
  },
  NEED_CONFIRMED: {
    label: "Besoin confirmé",
    className: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  IN_PROGRESS: {
    label: "En cours",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  WON: {
    label: "Gagné",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  LOST: {
    label: "Perdu",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  ON_HOLD: {
    label: "En pause",
    className: "bg-orange-100 text-orange-800 border-orange-200",
  },
  // Legacy lowercase values for backwards compatibility
  lead: {
    label: "Lead",
    className: "bg-gray-100 text-gray-800 border-gray-200",
  },
  contacted: {
    label: "Contacté",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  qualified: {
    label: "Qualifié",
    className: "bg-purple-100 text-purple-800 border-purple-200",
  },
  proposal: {
    label: "Proposition",
    className: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  negotiation: {
    label: "Négociation",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  won: {
    label: "Gagné",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  lost: {
    label: "Perdu",
    className: "bg-red-100 text-red-800 border-red-200",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.NEW;

  return (
    <Badge className={cn(config.className, className)}>{config.label}</Badge>
  );
}
