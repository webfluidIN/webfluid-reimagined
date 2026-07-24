import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Inbox, FileText, Users, RefreshCw, Receipt } from "lucide-react";
import { Link } from "react-router-dom";

interface Stats {
  newOnboarding: number;
  newQuotes: number;
  clients: number;
  upcomingRenewals: number;
  outstanding: number;
}

const StatCard = ({ icon: Icon, label, value, to, tone }: any) => (
  <Link to={to}>
    <Card className="p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tone}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
      </div>
    </Card>
  </Link>
);

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    newOnboarding: 0,
    newQuotes: 0,
    clients: 0,
    upcomingRenewals: 0,
    outstanding: 0,
  });
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    document.title = "Dashboard - Webfluid";
  }, []);

  useEffect(() => {

    (async () => {
      const in30 = new Date();
      in30.setDate(in30.getDate() + 30);
      const [ob, qs, cl, rn, inv, rec] = await Promise.all([
        supabase.from("onboarding_submissions").select("id", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("quote_submissions").select("id", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("clients").select("id", { count: "exact", head: true }),
        supabase.from("renewals").select("id", { count: "exact", head: true }).eq("status", "active").lte("renews_on", in30.toISOString().slice(0, 10)),
        supabase.from("invoices").select("total, status").in("status", ["sent", "overdue"]),
        supabase.from("onboarding_submissions").select("id, business_name, email, status, created_at").order("created_at", { ascending: false }).limit(6),
      ]);
      const outstanding = (inv.data ?? []).reduce((a: number, r: any) => a + Number(r.total || 0), 0);
      setStats({
        newOnboarding: ob.count ?? 0,
        newQuotes: qs.count ?? 0,
        clients: cl.count ?? 0,
        upcomingRenewals: rn.count ?? 0,
        outstanding,
      });
      setRecent(rec.data ?? []);
    })();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl">
      <h2 className="text-2xl font-display font-bold">Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard icon={Inbox} label="New onboarding" value={stats.newOnboarding} to="/admin/onboarding" tone="bg-primary/10 text-primary" />
        <StatCard icon={FileText} label="New quotes" value={stats.newQuotes} to="/admin/quotes" tone="bg-secondary/10 text-secondary" />
        <StatCard icon={Users} label="Clients" value={stats.clients} to="/admin/clients" tone="bg-blue-100 text-blue-700" />
        <StatCard icon={RefreshCw} label="Renewals ≤30d" value={stats.upcomingRenewals} to="/admin/renewals" tone="bg-orange-100 text-orange-700" />
        <StatCard icon={Receipt} label="Outstanding" value={`₹${stats.outstanding.toLocaleString()}`} to="/admin/invoices" tone="bg-green-100 text-green-700" />
      </div>

      <Card className="p-5">
        <h3 className="font-semibold mb-4">Recent onboarding submissions</h3>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">No submissions yet.</p>
        ) : (
          <ul className="divide-y">
            {recent.map((r) => (
              <li key={r.id}>
                <Link to={`/admin/onboarding/${r.id}`} className="flex justify-between py-3 hover:bg-muted/30 -mx-2 px-2 rounded">
                  <div>
                    <div className="font-medium">{r.business_name}</div>
                    <div className="text-xs text-muted-foreground">{r.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs uppercase font-semibold text-primary">{r.status}</div>
                    <div className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
