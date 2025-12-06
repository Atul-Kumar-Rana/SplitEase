import { useState } from 'react';
import type { Split } from '@/api/events';
import type { User } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, DollarSign, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DebitorRowProps {
  split: Split;
  user?: User;
  onPay?: (split: Split) => void;
  isCurrentUser?: boolean;
}

export function DebitorRow({ split, user, onPay, isCurrentUser }: DebitorRowProps) {
  const remaining = split.debAmount - split.amountPaid;
  const isPaid = split.settled || remaining <= 0;

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4 transition-colors',
        isCurrentUser && 'border-primary/30 bg-primary/5'
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full',
            isPaid ? 'bg-success/20' : 'bg-muted'
          )}
        >
          {isPaid ? (
            <Check className="h-5 w-5 text-success" />
          ) : (
            <UserIcon className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div>
          <p className="font-medium text-foreground">
            {user?.name || user?.username || `User #${split.userId}`}
            {isCurrentUser && <span className="ml-2 text-xs text-primary">(You)</span>}
          </p>
          <p className="text-sm text-muted-foreground">
            Share: ${split.debAmount.toFixed(2)} • Paid: ${split.amountPaid.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isPaid ? (
          <Badge variant="secondary" className="bg-success/20 text-success">
            Settled
          </Badge>
        ) : (
          <>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Owes</p>
              <p className="font-semibold text-destructive">${remaining.toFixed(2)}</p>
            </div>
            {onPay && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onPay(split)}
                className="border-primary/50 text-primary hover:bg-primary/10"
              >
                <DollarSign className="mr-1 h-4 w-4" />
                Pay
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
