import { Link, useLocation } from "react-router-dom";
import { 
  Calendar, 
  List, 
  Settings, 
  FileText, 
  CreditCard,
  Home,
  LogOut
} from "lucide-react";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", icon: Calendar, label: "Calendar" },
  { href: "/admin/bookings", icon: List, label: "Bookings" },
  { href: "/admin/invoices", icon: FileText, label: "Invoices" },
  { href: "/admin/payments", icon: CreditCard, label: "Payments" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <img src={logo} alt="Pavilion by Gold" className="h-12 w-auto" />
        <p className="text-xs text-sidebar-foreground/50 mt-2">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== "/admin" && location.pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-primary" 
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
        >
          <Home size={18} />
          <span className="font-medium">View Site</span>
        </Link>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors">
          <LogOut size={18} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
