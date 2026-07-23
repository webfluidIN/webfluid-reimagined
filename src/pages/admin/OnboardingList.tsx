import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/admin/StatusBadge";

const OnboardingList = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      let query = supabase.from("onboarding_submissions").select("*").order("created_at", { ascending: false });
      if (status !== "all") query = query.eq("status", status as any);
      const { data } = await query;
      setRows(data ?? []);
    })();
  }, [status]);

  const filtered = rows.filter(
    (r) =>
      !q ||
      r.business_name?.toLowerCase().includes(q.toLowerCase()) ||
      r.email?.toLowerCase().includes(q.toLowerCase()) ||
      r.full_name?.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="max-w-6xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold">Onboarding Submissions</h2>
      </div>
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <Input placeholder="Search name, business, email..." value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="proposal_sent">Proposal sent</SelectItem>
              <SelectItem value="won">Won</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No submissions.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground border-b">
                <tr>
                  <th className="text-left py-2 px-2">Business</th>
                  <th className="text-left py-2 px-2">Contact</th>
                  <th className="text-left py-2 px-2">Services</th>
                  <th className="text-left py-2 px-2">Status</th>
                  <th className="text-left py-2 px-2">Received</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b hover:bg-muted/30">
                    <td className="py-3 px-2">
                      <Link to={`/admin/onboarding/${r.id}`} className="font-medium hover:text-primary">{r.business_name}</Link>
                      <div className="text-xs text-muted-foreground">{r.full_name}</div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="text-xs">{r.email}</div>
                      <div className="text-xs text-muted-foreground">{r.phone}</div>
                    </td>
                    <td className="py-3 px-2 text-xs">{(r.services ?? []).slice(0, 3).join(", ")}</td>
                    <td className="py-3 px-2"><StatusBadge status={r.status} /></td>
                    <td className="py-3 px-2 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default OnboardingList;
