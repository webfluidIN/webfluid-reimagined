import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Loader2 } from "lucide-react";

interface QuoteDialogProps {
  children: React.ReactNode;
}

const QuoteDialog = ({ children }: QuoteDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    businessName: "",
    websiteType: "",
    message: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.businessName.trim() || !formData.websiteType) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("send-quote-request", {
        body: formData,
      });

      if (error) throw error;

      setIsSuccess(true);
      setFormData({
        name: "",
        phone: "",
        email: "",
        businessName: "",
        websiteType: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form when closing
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          name: "",
          phone: "",
          email: "",
          businessName: "",
          websiteType: "",
          message: "",
        });
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="w-16 h-16 text-secondary mb-4" />
            <DialogTitle className="text-2xl font-display mb-2">Thank You!</DialogTitle>
            <DialogDescription className="text-base">
              Thank you for choosing Webfluid. One of our executives will contact you soon.
            </DialogDescription>
            <Button 
              className="mt-6 gradient-bg text-primary-foreground"
              onClick={() => handleOpenChange(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-display">Request a Quote</DialogTitle>
              <DialogDescription>
                Fill in your details and we'll get back to you with a custom quote.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  maxLength={100}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  required
                  maxLength={20}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  maxLength={255}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  placeholder="Your business or company name"
                  value={formData.businessName}
                  onChange={(e) => handleChange("businessName", e.target.value)}
                  required
                  maxLength={150}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="websiteType">Type of Website *</Label>
                <Select
                  value={formData.websiteType}
                  onValueChange={(value) => handleChange("websiteType", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select website type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ecommerce">E-Commerce Website</SelectItem>
                    <SelectItem value="business">Business Website</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us more about your project..."
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  rows={4}
                  maxLength={1000}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full gradient-bg text-primary-foreground font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuoteDialog;
