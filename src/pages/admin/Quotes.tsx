import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/hooks/use-toast";

const Quotes = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState<any>(null);
  const [status, setStatus] = useState("new");
  const [notes, setNotes] = useState("");

  const load = async () => {
    const { data } = await supabase.from("quote_submissions").select("*").order("created_at", { ascending: false });
    setRows(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const openRow = (r: any) => { setOpen(r); setStatus(r.status); setNotes(r.admin_notes ?? ""); };

  const save = async () => {
    const { error } = await supabase.from("quote_submissions").update({ status: status as any, admin_notes: notes }).eq("id", open.id);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Saved" });
    setOpen(null);
    load();
  };

  return (
    <div className="max-w-6xl space-y-4">
      <h2 className="text-2xl font-display font-bold">Quote Requests</h2>
      <Card className="p-4">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No quote requests yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground border-b">
                <tr>
                  <th className="text-left py-2 px-2">Name</th>
                  <th className="text-left py-2 px-2">Contact</th>
                  <th className="text-left py-2 px-2">Service</th>
                  <th className="text-left py-2 px-2">Status</th>
                  <th className="text-left py-2 px-2">Received</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} onClick={() => openRow(r)} className="border-b hover:bg-muted/30 cursor-pointer">
                    <td className="py-3 px-2 font-medium">{r.name}</td>
                    <td className="py-3 px-2 text-xs">{r.email}<div className="text-muted-foreground">{r.phone}</div></td>
                    <td className="py-3 px-2 text-xs">{r.service}</td>
                    <td className="py-3 px-2"><StatusBadge status={r.status} /></td>
                    <td className="py-3 px-2 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {open && (
            <>
              <SheetHeader><SheetTitle>{open.name}</SheetTitle></SheetHeader>
              <div className="mt-4 space-y-3 text-sm">
                <div><b>Email:</b> {open.email}</div>
                <div><b>Phone:</b> {open.phone}</div>
                <div><b>Service:</b> {open.service}</div>
                {open.data?.businessName && <div><b>Business:</b> {open.data.businessName}</div>}
                {open.message && <div><b>Message:</b><div className="whitespace-pre-wrap text-muted-foreground">{open.message}</div></div>}
                <div className="pt-4 border-t space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="proposal_sent">Proposal sent</SelectItem>
                      <SelectItem value="won">Won</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
                  <Button onClick={save} className="w-full">Save</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Quotes;
