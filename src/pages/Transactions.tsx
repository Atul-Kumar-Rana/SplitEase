import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { listTransactions, type Transaction } from '@/api/payments';
import { listUsers, type User } from '@/api/users';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Loader2, ArrowLeftRight } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function Transactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txData, usersData] = await Promise.all([listTransactions(), listUsers()]);
        setTransactions(txData);
        setUsers(usersData);
      } catch (error) {
        toast.error('Failed to load transactions');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getUserById = (userId: number) => users.find((u) => u.id === userId);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Transactions</h1>

      {transactions.length === 0 ? (
        <Card className="border-border/50 border-dashed bg-card/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ArrowLeftRight className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium text-foreground">No transactions yet</p>
            <p className="text-sm text-muted-foreground">Payments will appear here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => {
            const fromUser = getUserById(tx.fromUser);
            const toUser = getUserById(tx.toUser);
            const isIncoming = tx.toUser === user?.id;

            return (
              <Card key={tx.id} className="border-border/50 bg-card">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        isIncoming ? 'bg-success/20' : 'bg-destructive/20'
                      }`}
                    >
                      <ArrowRight
                        className={`h-5 w-5 ${isIncoming ? 'rotate-180 text-success' : 'text-destructive'}`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-foreground">
                          {fromUser?.name || fromUser?.username || `User #${tx.fromUser}`}
                        </span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                          {toUser?.name || toUser?.username || `User #${tx.toUser}`}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {tx.note || 'Payment'} • {format(new Date(tx.ts), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`text-lg font-bold ${
                      isIncoming ? 'text-success' : 'text-destructive'
                    }`}
                  >
                    {isIncoming ? '+' : '-'}${tx.amount.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
