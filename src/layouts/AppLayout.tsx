import { Outlet } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Sidebar, MobileNav } from '@/components/Sidebar';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="pb-20 pt-6 md:ml-64 md:pb-6">
        <div className="container mx-auto px-4 md:px-6">
          <Outlet />
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
