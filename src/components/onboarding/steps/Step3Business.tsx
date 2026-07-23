import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StepProps } from "../OnboardingWizard";
import { Button } from "@/components/ui/button";

const Step3Business = ({ data, update }: StepProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Logo must be under 5MB", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "bin";
      const path = `logos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("onboarding-uploads").upload(path, file, {
        contentType: file.type,
        upsert: false,
      });
      if (error) throw error;
      update({ logoStoragePath: path, logoFileName: file.name });
      toast({ title: "Logo uploaded" });
    } catch (e) {
      console.error(e);
      toast({ title: "Upload failed", description: "Please try a different file.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const updateSocial = (k: keyof typeof data.socials, v: string) =>
    update({ socials: { ...data.socials, [k]: v } });

  const updateColor = (i: number, v: string) => {
    const arr = [...data.brandColors];
    arr[i] = v;
    update({ brandColors: arr });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-display font-bold mb-1">Your business profile</h3>
        <p className="text-sm text-muted-foreground">Help us understand your brand and audience.</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="aboutBusiness">About your business *</Label>
        <Textarea
          id="aboutBusiness"
          rows={4}
          maxLength={1500}
          placeholder="What do you do, who do you serve, what makes you different?"
          value={data.aboutBusiness}
          onChange={(e) => update({ aboutBusiness: e.target.value })}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="industry">Industry / category</Label>
          <Input id="industry" value={data.industry} onChange={(e) => update({ industry: e.target.value })} maxLength={100} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="existingWebsite">Existing website (if any)</Label>
          <Input id="existingWebsite" placeholder="https://" value={data.existingWebsite} onChange={(e) => update({ existingWebsite: e.target.value })} maxLength={255} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="targetAudience">Target audience</Label>
        <Textarea id="targetAudience" rows={2} maxLength={500} placeholder="Who are your ideal customers?" value={data.targetAudience} onChange={(e) => update({ targetAudience: e.target.value })} />
      </div>

      <div>
        <Label>Social media URLs (optional)</Label>
        <div className="grid md:grid-cols-2 gap-3 mt-2">
          {(["facebook", "instagram", "linkedin", "youtube", "tiktok", "x"] as const).map((k) => (
            <Input key={k} placeholder={`${k.charAt(0).toUpperCase() + k.slice(1)} URL`} value={data.socials[k]} onChange={(e) => updateSocial(k, e.target.value)} maxLength={255} />
          ))}
        </div>
      </div>

      <div>
        <Label>Brand colors (optional)</Label>
        <div className="flex gap-3 mt-2 flex-wrap">
          {data.brandColors.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="color"
                value={c || "#ffffff"}
                onChange={(e) => updateColor(i, e.target.value)}
                className="w-12 h-10 rounded border border-border cursor-pointer"
              />
              <Input value={c} onChange={(e) => updateColor(i, e.target.value)} placeholder="#hex" className="w-28" maxLength={20} />
            </div>
          ))}
        </div>
        <Input
          className="mt-3"
          placeholder="Notes on brand palette (optional)"
          value={data.brandColorsNote}
          onChange={(e) => update({ brandColorsNote: e.target.value })}
          maxLength={300}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="designReferences">Design references / inspiration (optional)</Label>
        <Textarea id="designReferences" rows={3} maxLength={800} placeholder="Paste URLs of sites you love, one per line" value={data.designReferences} onChange={(e) => update({ designReferences: e.target.value })} />
      </div>

      <div>
        <Label>Logo (optional, PNG/SVG/JPG, max 5MB)</Label>
        <div className="mt-2">
          {data.logoStoragePath ? (
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
              <span className="text-sm truncate flex-1">{data.logoFileName}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => update({ logoStoragePath: "", logoFileName: "" })}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <label className="flex items-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
              {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              <span className="text-sm text-muted-foreground">
                {uploading ? "Uploading..." : "Click to upload your logo"}
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                disabled={uploading}
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step3Business;
