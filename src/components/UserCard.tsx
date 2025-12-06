import type { User } from '@/api/auth';
import { Card, CardContent } from '@/components/ui/card';
import { User as UserIcon } from 'lucide-react';

interface UserCardProps {
  user: User;
  selected?: boolean;
  onClick?: () => void;
}

export function UserCard({ user, selected, onClick }: UserCardProps) {
  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer border-border/50 transition-all duration-200 ${
        selected
          ? 'border-primary bg-primary/10 glow-accent-sm'
          : 'bg-card hover:border-primary/30 hover:bg-secondary/50'
      }`}
    >
      <CardContent className="flex items-center gap-3 p-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            selected ? 'bg-primary/30' : 'bg-muted'
          }`}
        >
          <UserIcon className={`h-5 w-5 ${selected ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="truncate font-medium text-foreground">{user.name || user.username}</p>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
        </div>
      </CardContent>
    </Card>
  );
}
