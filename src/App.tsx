import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import OnboardingList from "./pages/admin/OnboardingList";
import OnboardingDetail from "./pages/admin/OnboardingDetail";
import Quotes from "./pages/admin/Quotes";
import Clients from "./pages/admin/Clients";
import ClientDetail from "./pages/admin/ClientDetail";
import Invoices from "./pages/admin/Invoices";
import InvoiceEdit from "./pages/admin/InvoiceEdit";
import InvoiceDetail from "./pages/admin/InvoiceDetail";
import Renewals from "./pages/admin/Renewals";
import Settings from "./pages/admin/Settings";
import CompanySettings from "./pages/admin/CompanySettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="onboarding" element={<OnboardingList />} />
              <Route path="onboarding/:id" element={<OnboardingDetail />} />
              <Route path="quotes" element={<Quotes />} />
              <Route path="clients" element={<Clients />} />
              <Route path="clients/:id" element={<ClientDetail />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="invoices/new" element={<InvoiceEdit />} />
              <Route path="invoices/:id" element={<InvoiceDetail />} />
              <Route path="invoices/:id/edit" element={<InvoiceEdit />} />
              <Route path="renewals" element={<Renewals />} />
              <Route path="settings" element={<Settings />} />
              <Route path="company-settings" element={<CompanySettings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
