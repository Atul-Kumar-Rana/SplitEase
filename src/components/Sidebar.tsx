import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, PlusCircle, Receipt, User, ArrowLeftRight } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/events/new', icon: PlusCircle, label: 'New Expense' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] w-64 border-r border-border/50 bg-sidebar md:block">
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary glow-accent-sm'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 px-4 py-2 text-xs font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
