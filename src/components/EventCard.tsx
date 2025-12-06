import { Link } from 'react-router-dom';
import type { Event } from '@/api/events';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Receipt, Users, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  currentUserId: number;
}

export function EventCard({ event, currentUserId }: EventCardProps) {
  const userSplit = event.splits?.find((s) => s.userId === currentUserId);
  const owes = userSplit ? userSplit.debAmount - userSplit.amountPaid : 0;
  const participantCount = event.splits?.filter((s) => s.included).length || 0;

  return (
    <Link to={`/events/${event.id}`}>
      <Card className="group cursor-pointer border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:glow-accent-sm">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Receipt className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-foreground">{event.title}</CardTitle>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>{participantCount} participants</span>
              </div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-semibold text-foreground">${event.total.toFixed(2)}</p>
            </div>
            {userSplit && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Your share</p>
                <p
                  className={cn(
                    'text-lg font-semibold',
                    owes > 0 ? 'text-destructive' : owes < 0 ? 'text-success' : 'text-muted-foreground'
                  )}
                >
                  {owes > 0 ? `-$${owes.toFixed(2)}` : owes < 0 ? `+$${Math.abs(owes).toFixed(2)}` : 'Settled'}
                </p>
              </div>
            )}
          </div>
          <div className="mt-3 flex gap-2">
            {event.cancelled && (
              <Badge variant="destructive" className="text-xs">
                Cancelled
              </Badge>
            )}
            {userSplit?.settled && (
              <Badge variant="secondary" className="bg-success/20 text-success text-xs">
                Paid
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
