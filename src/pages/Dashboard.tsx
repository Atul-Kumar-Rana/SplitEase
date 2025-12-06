// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '@/context/AuthContext';
// import { listEvents, type Event } from '@/api/events';
// import { EventCard } from '@/components/EventCard';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { PlusCircle, TrendingUp, TrendingDown, Wallet, Loader2, Receipt } from 'lucide-react';
// import { toast } from 'sonner';

// export default function Dashboard() {
//   const { user } = useAuth();
//   const [events, setEvents] = useState<Event[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const data = await listEvents();
//         setEvents(data);
//       } catch (error) {
//         toast.error('Failed to load events');
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchEvents();
//   }, []);

//   // Calculate balances
//   const balances = events.reduce(
//     (acc, event) => {
//       if (event.cancelled) return acc;
      
//       const userSplit = event.splits?.find((s) => s.userId === user?.id);
//       if (userSplit) {
//         const owes = userSplit.debAmount - userSplit.amountPaid;
//         if (owes > 0) {
//           acc.youOwe += owes;
//         } else if (owes < 0) {
//           acc.youAreOwed += Math.abs(owes);
//         }
//       }
//       return acc;
//     },
//     { youOwe: 0, youAreOwed: 0 }
//   );

//   const netBalance = balances.youAreOwed - balances.youOwe;
//   const recentEvents = events.slice(0, 5);

//   if (isLoading) {
//     return (
//       <div className="flex min-h-[60vh] items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 animate-fade-in">
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground">
//             Hello, {user?.name || user?.username || 'there'}!
//           </h1>
//           <p className="text-muted-foreground">Here's your expense summary</p>
//         </div>
//         <Link to="/events/new">
//           <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-accent-sm">
//             <PlusCircle className="mr-2 h-4 w-4" />
//             New Expense
//           </Button>
//         </Link>
//       </div>

//       {/* Balance Cards */}
//       <div className="grid gap-4 sm:grid-cols-3">
//         <Card className="border-border/50 bg-card">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Net Balance</CardTitle>
//             <Wallet className="h-5 w-5 text-primary" />
//           </CardHeader>
//           <CardContent>
//             <p
//               className={`text-2xl font-bold ${
//                 netBalance > 0
//                   ? 'text-success'
//                   : netBalance < 0
//                   ? 'text-destructive'
//                   : 'text-foreground'
//               }`}
//             >
//               {netBalance >= 0 ? '+' : '-'}${Math.abs(netBalance).toFixed(2)}
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="border-border/50 bg-card">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">You Are Owed</CardTitle>
//             <TrendingUp className="h-5 w-5 text-success" />
//           </CardHeader>
//           <CardContent>
//             <p className="text-2xl font-bold text-success">+${balances.youAreOwed.toFixed(2)}</p>
//           </CardContent>
//         </Card>

//         <Card className="border-border/50 bg-card">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">You Owe</CardTitle>
//             <TrendingDown className="h-5 w-5 text-destructive" />
//           </CardHeader>
//           <CardContent>
//             <p className="text-2xl font-bold text-destructive">-${balances.youOwe.toFixed(2)}</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Recent Events */}
//       <div>
//         <div className="mb-4 flex items-center justify-between">
//           <h2 className="text-lg font-semibold text-foreground">Recent Expenses</h2>
//           {events.length > 5 && (
//             <Link to="/transactions" className="text-sm text-primary hover:underline">
//               View all
//             </Link>
//           )}
//         </div>

//         {recentEvents.length === 0 ? (
//           <Card className="border-border/50 border-dashed bg-card/50">
//             <CardContent className="flex flex-col items-center justify-center py-12">
//               <Receipt className="mb-4 h-12 w-12 text-muted-foreground" />
//               <p className="text-lg font-medium text-foreground">No expenses yet</p>
//               <p className="mb-4 text-sm text-muted-foreground">Create your first expense to get started</p>
//               <Link to="/events/new">
//                 <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
//                   <PlusCircle className="mr-2 h-4 w-4" />
//                   Create Expense
//                 </Button>
//               </Link>
//             </CardContent>
//           </Card>
//         ) : (
//           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {recentEvents.map((event) => (
//               <EventCard key={event.id} event={event} currentUserId={user?.id || 0} />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { listEvents, type Event } from '@/api/events';
import { EventCard } from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PlusCircle,
  TrendingUp,
  TrendingDown,
  Wallet,
  Loader2,
  Receipt,
} from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await listEvents();
        setEvents(data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // ✅ Use backend-computed balances from /api/users/me
  const youAreOwed = Number((user as any)?.owedToYou ?? 0);
  const youOwe = Number((user as any)?.youOwe ?? 0);
  const netBalance = youAreOwed - youOwe;

  const recentEvents = events.slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Hello, {(user as any)?.name || (user as any)?.username || 'there'}!
          </h1>
          <p className="text-muted-foreground">Here&apos;s your expense summary</p>
        </div>
        <Link to="/events/new">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-accent-sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Expense
          </Button>
        </Link>
      </div>

      {/* Balance Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Net Balance */}
        <Card className="border-border/50 bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net Balance
            </CardTitle>
            <Wallet className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-bold ${
                netBalance > 0
                  ? 'text-success'
                  : netBalance < 0
                  ? 'text-destructive'
                  : 'text-foreground'
              }`}
            >
              {netBalance >= 0 ? '+' : '-'}₹{Math.abs(netBalance).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        {/* You Are Owed */}
        <Card className="border-border/50 bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              You Are Owed
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-success">
              +₹{youAreOwed.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        {/* You Owe */}
        <Card className="border-border/50 bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              You Owe
            </CardTitle>
            <TrendingDown className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-destructive">
              -₹{youOwe.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Recent Expenses</h2>
          {events.length > 5 && (
            <Link
              to="/transactions"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          )}
        </div>

        {recentEvents.length === 0 ? (
          <Card className="border-border/50 border-dashed bg-card/50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Receipt className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium text-foreground">No expenses yet</p>
              <p className="mb-4 text-sm text-muted-foreground">
                Create your first expense to get started
              </p>
              <Link to="/events/new">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Expense
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                currentUserId={user?.id || 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
