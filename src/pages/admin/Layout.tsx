import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/AppSidebar";
import RequireAdmin from "@/components/admin/RequireAdmin";
import webfluidLogo from "@/assets/webfluid-logo.png";

const AdminLayout = () => (
  <RequireAdmin>
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b bg-background px-4 gap-3">
            <SidebarTrigger />
            <img src={webfluidLogo} alt="Webfluid" className="h-7 w-auto" />
            <h1 className="font-semibold">Admin</h1>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  </RequireAdmin>
);

export default AdminLayout;
