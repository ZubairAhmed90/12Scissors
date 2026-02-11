import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Scissors, LayoutDashboard, Calendar, Users, Settings, LogOut, X, Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const menuItems = [
  { title: 'Dashboard', url: '/vendor/dashboard', icon: LayoutDashboard },
  { title: 'Bookings', url: '/vendor/bookings', icon: Calendar },
  { title: 'Discount Codes', url: '/vendor/discount-codes', icon: Tag },
  { title: 'Customers', url: '/vendor/customers', icon: Users },
  { title: 'Settings', url: '/vendor/settings', icon: Settings },
];

const VendorSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setOpenMobile, isMobile } = useSidebar();

  const handleLogout = () => {
    localStorage.removeItem('vendor');
    navigate('/vendor/login');
  };

  const isActive = (url: string) => {
    if (url === '/vendor/dashboard') {
      return location.pathname === '/vendor/dashboard';
    }
    return location.pathname.startsWith(url);
  };

  return (
    <Sidebar className="border-r border-border bg-sidebar" collapsible="offcanvas">
      <SidebarContent className="flex flex-col h-full">
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Scissors className="h-8 w-8 text-primary" />
            <span className="font-display text-xl font-bold text-sidebar-foreground">12Scissors</span>
          </Link>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setOpenMobile(false)}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        <SidebarGroup className="flex-1 pt-4">
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      onClick={() => isMobile && setOpenMobile(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                        isActive(item.url)
                          ? "bg-primary/10 text-primary"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default VendorSidebar;
