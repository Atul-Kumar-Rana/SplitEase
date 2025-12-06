// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getEvent, type EventDetail } from '@/api/events';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { ArrowLeft, Loader2, Users } from 'lucide-react';
// import { toast } from 'sonner';

// export default function EventView() {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [event, setEvent] = useState<EventDetail | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchEvent = async () => {
//       if (!id) return;
//       try {
//         const data = await getEvent(id);
//         setEvent(data);
//       } catch (error) {
//         console.error(error);
//         toast.error('Failed to load event');
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchEvent();
//   }, [id]);

//   if (isLoading) {
//     return (
//       <div className="flex min-h-[60vh] items-center justify-center">
//         <Loader2 className="h-6 w-6 animate-spin text-primary" />
//       </div>
//     );
//   }

//   if (!event) {
//     return (
//       <div className="mx-auto max-w-3xl">
//         <Button
//           variant="ghost"
//           onClick={() => navigate(-1)}
//           className="mb-6 text-muted-foreground hover:text-foreground"
//         >
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back
//         </Button>
//         <p className="text-muted-foreground">Event not found.</p>
//       </div>
//     );
//   }

//   const total = event.total ?? 0;

//   return (
//     <div className="mx-auto max-w-3xl animate-fade-in">
//       <Button
//         variant="ghost"
//         onClick={() => navigate(-1)}
//         className="mb-6 text-muted-foreground hover:text-foreground"
//       >
//         <ArrowLeft className="mr-2 h-4 w-4" />
//         Back
//       </Button>

//       <Card className="mb-6 border-border/50 bg-card">
//         <CardHeader>
//           <CardTitle className="flex items-center justify-between text-foreground">
//             <span>{event.title}</span>
//             <span className="text-lg font-semibold text-primary">₹{total}</span>
//           </CardTitle>
//           <CardDescription className="mt-1 space-y-1 text-sm text-muted-foreground">
//             <p>
//               Created by{' '}
//               <span className="font-medium text-foreground">
//                 {event.creatorUsername ?? 'Unknown'}
//               </span>
//             </p>
//             <p>
//               Created at:{' '}
//               <span className="font-mono">
//                 {event.createdAt ? new Date(event.createdAt).toLocaleString() : 'N/A'}
//               </span>
//             </p>
//             {event.cancelled && (
//               <p className="font-medium text-red-400">This event is cancelled</p>
//             )}
//           </CardDescription>
//         </CardHeader>
//       </Card>

//       <Card className="border-border/50 bg-card">
//         <CardHeader className="flex flex-row items-center justify-between gap-2">
//           <div className="flex items-center gap-2">
//             <Users className="h-4 w-4 text-muted-foreground" />
//             <div>
//               <CardTitle className="text-base text-foreground">Debitors</CardTitle>
//               <CardDescription>Who owes what for this expense</CardDescription>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {event.splits.length === 0 ? (
//             <p className="text-sm text-muted-foreground">No debitors found for this event.</p>
//           ) : (
//             <div className="space-y-2">
//               {event.splits.map((d) => (
//                 <div
//                   key={d.id}
//                   className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-3 text-sm"
//                 >
//                   <div className="flex flex-col">
//                     <span className="font-medium text-foreground">
//                       {d.username ?? 'Unknown user'}
//                     </span>
//                     <span className="text-xs text-muted-foreground">
//                       Debits: ₹{d.debAmount} · Paid: ₹{d.amountPaid} · Left: ₹{d.remaining}
//                     </span>
//                   </div>
//                   <div className="text-right text-xs">
//                     <span
//                       className={
//                         d.settled
//                           ? 'rounded-full bg-emerald-500/10 px-2 py-1 text-emerald-400'
//                           : 'rounded-full bg-amber-500/10 px-2 py-1 text-amber-300'
//                       }
//                     >
//                       {d.settled ? 'Settled' : 'Pending'}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEvent, deleteEvent, type EventDetail, type EventSplit } from '@/api/events';
import { payDebitor } from '@/api/payments';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Loader2, Users, Trash2, IndianRupee, Wallet } from 'lucide-react';
import { toast } from 'sonner';

export default function EventView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPayingId, setIsPayingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadEvent = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await getEvent(id);
      setEvent(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load event');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  const handlePayFull = async (split: EventSplit) => {
    if (!user) {
      toast.error('You must be logged in to pay');
      return;
    }
    if (split.remaining <= 0) {
      return;
    }

    setIsPayingId(split.id);
    try {
      await payDebitor({
        debitorId: split.id,
        payerUserId: user.id,
        amount: split.remaining,
      });
      toast.success('Payment recorded');
      await loadEvent();
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to record payment',
      );
    } finally {
      setIsPayingId(null);
    }
  };

  const handleDeleteEvent = async () => {
    if (!event || !id) return;

    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteEvent(id);
      toast.success('Event deleted');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete event');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <p className="text-muted-foreground">Event not found.</p>
      </div>
    );
  }

  const total = event.total ?? 0;
  const allSettled =
    event.splits.length > 0 &&
    event.splits.every((s) => s.settled || s.remaining <= 0);

  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card className="mb-6 border-border/50 bg-card">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-foreground">{event.title}</CardTitle>
            <div className="flex items-center gap-1 text-primary">
              <IndianRupee className="h-4 w-4" />
              <span className="text-lg font-semibold">{total}</span>
            </div>
          </div>

          <CardDescription className="mt-1 space-y-1 text-sm text-muted-foreground">
            <p>
              Created by{' '}
              <span className="font-medium text-foreground">
                {event.creatorUsername ?? 'Unknown'}
              </span>
            </p>
            <p>
              Created at{' '}
              <span className="font-mono">
                {event.createdAt
                  ? new Date(event.createdAt).toLocaleString()
                  : 'N/A'}
              </span>
            </p>
            {event.cancelled && (
              <p className="font-medium text-red-400">This event is cancelled</p>
            )}
          </CardDescription>

          <div className="flex flex-wrap gap-2 pt-2">
            {allSettled && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteEvent}
                disabled={isDeleting}
                className="gap-2"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete Event
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      <Card className="border-border/50 bg-card">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <CardTitle className="text-base text-foreground">Debitors</CardTitle>
              <CardDescription>Who owes what for this expense</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {event.splits.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No debitors found for this event.
            </p>
          ) : (
            <div className="space-y-2">
              {event.splits.map((d) => {
                const isCurrentUser = user && d.userId === user.id;
                const canPay = isCurrentUser && d.remaining > 0;

                return (
                  <div
                    key={d.id}
                    className="flex flex-col gap-2 rounded-lg border border-border/50 bg-secondary/30 p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {d.username ?? 'Unknown user'}
                        {isCurrentUser && (
                          <span className="ml-1 text-xs text-primary">(You)</span>
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Debits: ₹{d.debAmount} · Paid: ₹{d.amountPaid} · Left: ₹
                        {d.remaining}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 sm:flex-row sm:gap-3">
                      <span
                        className={
                          d.settled
                            ? 'rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-400'
                            : 'rounded-full bg-amber-500/10 px-2 py-1 text-xs text-amber-300'
                        }
                      >
                        {d.settled ? 'Settled' : 'Pending'}
                      </span>

                      {canPay && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePayFull(d)}
                          disabled={isPayingId === d.id}
                          className="gap-1"
                        >
                          {isPayingId === d.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Wallet className="h-3 w-3" />
                          )}
                          Pay ₹{d.remaining}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
