import { Link, useLocation } from "react-router-dom";
import { 
  Zap, 
  LayoutDashboard, 
  FileText, 
  User, 
  Settings, 
  HelpCircle,
  LogOut,
  Upload,
  TrendingUp,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FileText, label: "Invoices", href: "/dashboard/invoices" },
  { icon: Upload, label: "Upload", href: "/dashboard/upload" },
  { icon: TrendingUp, label: "Analytics", href: "/dashboard/analytics" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-border bg-sidebar flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">
            cred<span className="text-gradient">IA</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Help & Logout */}
        <div className="p-4 space-y-1 border-t border-border">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted w-full transition-all">
            <HelpCircle className="w-5 h-5" />
            Help & Support
          </button>
          <Link 
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 w-full transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign out
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-64">
        {/* Top bar */}
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-40">
          <div>
            <h1 className="text-lg font-semibold">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Here's what's happening with your financing</p>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
            </Button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
              JS
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
