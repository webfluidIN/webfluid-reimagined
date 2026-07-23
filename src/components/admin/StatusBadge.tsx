import { cn } from "@/lib/utils";

const map: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  proposal_sent: "bg-purple-100 text-purple-700",
  won: "bg-green-100 text-green-700",
  lost: "bg-gray-200 text-gray-700",
  draft: "bg-gray-200 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  paid: "bg-green-100 text-green-700",
  overdue: "bg-red-100 text-red-700",
  void: "bg-gray-200 text-gray-700",
  active: "bg-green-100 text-green-700",
  cancelled: "bg-gray-200 text-gray-700",
  expired: "bg-red-100 text-red-700",
};

export const StatusBadge = ({ status }: { status: string }) => (
  <span className={cn("text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide", map[status] ?? "bg-muted")}>
    {status.replace(/_/g, " ")}
  </span>
);
