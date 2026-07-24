import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Plus } from "lucide-react";

const Invoices = () => {
  const [sp, setSp] = useSearchParams();
  const tab = sp.get("tab") === "quotes" ? "quotes" : "invoices";
  const docType = tab === "quotes" ? "quote" : "invoice";
  const [rows, setRows] = useState<any[]>([]);
  const [status, setStatus] = useState("all");

  useEffect(() => {
    (async () => {
      let q = supabase.from("invoices").select("*, clients(business_name)").eq("document_type", docType).order("created_at", { ascending: false });
      if (status !== "all") q = q.eq("status", status as any);
      const { data } = await q;
      setRows(data ?? []);
    })();
  }, [status, docType]);

  const setTab = (t: string) => {
    const n = new URLSearchParams(sp);
    if (t === "quotes") n.set("tab", "quotes"); else n.delete("tab");
    setSp(n);
    setStatus("all");
  };

  return (
    <div className="max-w-6xl space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-2xl font-display font-bold">Invoices & Quotations</h2>
        <Link to={docType === "quote" ? "/admin/invoices/new?type=quote" : "/admin/invoices/new"}>
          <Button><Plus className="w-4 h-4 mr-2" /> New {docType === "quote" ? "quotation" : "invoice"}</Button>
        </Link>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="quotes">Quotations</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="p-4">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-48 mb-4"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            {docType === "invoice" && <SelectItem value="paid">Paid</SelectItem>}
            {docType === "invoice" && <SelectItem value="overdue">Overdue</SelectItem>}
            {docType === "quote" && <SelectItem value="paid">Accepted</SelectItem>}
            <SelectItem value="void">{docType === "quote" ? "Declined" : "Void"}</SelectItem>
          </SelectContent>
        </Select>

        {rows.length === 0 ? <p className="text-sm text-muted-foreground text-center py-6">No {docType === "quote" ? "quotations" : "invoices"}.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground border-b">
                <tr>
                  <th className="text-left py-2 px-2">Number</th>
                  <th className="text-left py-2 px-2">Client</th>
                  <th className="text-left py-2 px-2">Issue date</th>
                  <th className="text-left py-2 px-2">{docType === "quote" ? "Valid until" : "Due date"}</th>
                  <th className="text-left py-2 px-2">Total</th>
                  <th className="text-left py-2 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b hover:bg-muted/30">
                    <td className="py-3 px-2 font-mono"><Link to={`/admin/invoices/${r.id}`} className="hover:text-primary">{r.invoice_number}</Link></td>
                    <td className="py-3 px-2">{r.clients?.business_name}</td>
                    <td className="py-3 px-2">{r.issue_date}</td>
                    <td className="py-3 px-2 text-muted-foreground">{docType === "quote" ? (r.valid_until ?? "—") : (r.due_date ?? "—")}</td>
                    <td className="py-3 px-2">{r.currency} {Number(r.total).toLocaleString()}</td>
                    <td className="py-3 px-2"><StatusBadge status={r.status} /></td>
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

export default Invoices;
