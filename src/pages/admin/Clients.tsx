import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Clients = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ full_name: "", business_name: "", email: "", phone: "" });

  const load = async () => {
    const { data } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
    setRows(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.full_name || !form.business_name || !form.email) {
      return toast({ title: "Fill required fields", variant: "destructive" });
    }
    const { error } = await supabase.from("clients").insert(form);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Client added" });
    setOpen(false);
    setForm({ full_name: "", business_name: "", email: "", phone: "" });
    load();
  };

  const filtered = rows.filter((r) =>
    !q || [r.full_name, r.business_name, r.email].some((s) => s?.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div className="max-w-6xl space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold">Clients</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Add client</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New client</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Full name *</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
              <div><Label>Business *</Label><Input value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} /></div>
              <div><Label>Email *</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <Button className="w-full" onClick={create}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-4">
        <Input placeholder="Search clients..." value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm mb-4" />
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No clients yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground border-b">
                <tr>
                  <th className="text-left py-2 px-2">Business</th>
                  <th className="text-left py-2 px-2">Contact</th>
                  <th className="text-left py-2 px-2">Location</th>
                  <th className="text-left py-2 px-2">Added</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b hover:bg-muted/30">
                    <td className="py-3 px-2">
                      <Link to={`/admin/clients/${r.id}`} className="font-medium hover:text-primary">{r.business_name}</Link>
                      <div className="text-xs text-muted-foreground">{r.full_name}</div>
                    </td>
                    <td className="py-3 px-2 text-xs">{r.email}<div className="text-muted-foreground">{r.phone}</div></td>
                    <td className="py-3 px-2 text-xs">{[r.city, r.country].filter(Boolean).join(", ")}</td>
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

export default Clients;
