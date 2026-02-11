import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import VendorSidebar from './VendorSidebar';

interface VendorLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
}

const VendorLayout = ({ children, title, subtitle, headerActions }: VendorLayoutProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const vendor = localStorage.getItem('vendor');
    if (!vendor) {
      navigate('/vendor/login');
    }
  }, [navigate]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background dark">
        <VendorSidebar />
        
        <main className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <header className="sticky top-0 z-40 glass-dark border-b border-border px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-foreground md:hidden" />
                <div>
                  <h1 className="font-display text-xl md:text-2xl font-bold text-foreground">{title}</h1>
                  {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
                </div>
              </div>
              {headerActions}
            </div>
          </header>

          <div className="flex-1 p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default VendorLayout;
