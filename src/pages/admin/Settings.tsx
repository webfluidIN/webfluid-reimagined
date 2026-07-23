import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("display_name").eq("id", user.id).single().then(({ data }) => {
      setDisplayName(data?.display_name ?? "");
    });
  }, [user]);

  const save = async () => {
    const { error } = await supabase.from("profiles").update({ display_name: displayName }).eq("id", user!.id);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Saved" });
  };

  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-2xl font-display font-bold">Settings</h2>
      <Card className="p-5 space-y-3">
        <div><Label>Email</Label><Input value={user?.email ?? ""} disabled /></div>
        <div><Label>Display name</Label><Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} /></div>
        <div className="text-xs text-muted-foreground">Role: {isAdmin ? "Admin" : "Staff"}</div>
        <div className="flex gap-2">
          <Button onClick={save}>Save</Button>
          <Button variant="outline" onClick={() => signOut()}>Sign out</Button>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
