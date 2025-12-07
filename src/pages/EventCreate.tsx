// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/context/AuthContext';
// import { createEvent } from '@/api/events';
// import { listUsers, type MinimalUser } from '@/api/users';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { ArrowLeft, Loader2, Receipt, Users, Search, Check } from 'lucide-react';
// import { toast } from 'sonner';
// import { z } from 'zod';

// const eventSchema = z.object({
//   title: z
//     .string()
//     .min(1, 'Title is required')
//     .max(100, 'Title must be less than 100 characters'),
//   total: z.number().positive('Amount must be greater than 0'),
// });

// export default function EventCreate() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [title, setTitle] = useState('');
//   const [total, setTotal] = useState('');
//   const [users, setUsers] = useState<MinimalUser[]>([]);
//   const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isLoadingUsers, setIsLoadingUsers] = useState(true);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const data = await listUsers();
//         setUsers(data || []);
//         if (user?.id) {
//           setSelectedUserIds([user.id]);
//         }
//       } catch (error) {
//         console.error(error);
//         toast.error('Failed to load users');
//       } finally {
//         setIsLoadingUsers(false);
//       }
//     };
//     fetchUsers();
//   }, [user?.id]);

//   const toggleUser = (userId: number) => {
//     setSelectedUserIds((prev) =>
//       prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
//     );
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const totalNum = parseFloat(total);
//     const validation = eventSchema.safeParse({ title, total: totalNum });
//     if (!validation.success) {
//       toast.error(validation.error.errors[0].message);
//       return;
//     }

//     if (Number.isNaN(totalNum)) {
//       toast.error('Please enter a valid amount');
//       return;
//     }

//     if (selectedUserIds.length < 2) {
//       toast.error('Please select at least 2 participants');
//       return;
//     }

//     if (!user?.id) {
//       toast.error('User not loaded. Please try logging in again.');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const event = await createEvent({
//         title,
//         creatorId: user.id,
//         total: totalNum,
//         participants: selectedUserIds.map((userId) => ({
//           userId,
//           included: true,
//         })),
//       });

//       toast.success('Expense created successfully!');
//       navigate(`/events/${event.id}`);
//     } catch (error) {
//       console.error(error);
//       toast.error(error instanceof Error ? error.message : 'Failed to create expense');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const filteredUsers = users.filter((u) => {
//     const q = searchTerm.toLowerCase().trim();
//     if (!q) return true;
//     const name = (u.username || '').toLowerCase();
//     return name.includes(q);
//   });

//   return (
//     <div className="mx-auto max-w-2xl animate-fade-in">
//       <Button
//         variant="ghost"
//         onClick={() => navigate(-1)}
//         className="mb-6 text-muted-foreground hover:text-foreground"
//       >
//         <ArrowLeft className="mr-2 h-4 w-4" />
//         Back
//       </Button>

//       <Card className="border-border/50 bg-card">
//         <CardHeader>
//           <div className="flex items-center gap-3">
//             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
//               <Receipt className="h-6 w-6 text-primary" />
//             </div>
//             <div>
//               <CardTitle className="text-xl text-foreground">Create New Expense</CardTitle>
//               <CardDescription>Split a bill with your friends</CardDescription>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="space-y-2">
//               <Label htmlFor="title" className="text-foreground">
//                 Description
//               </Label>
//               <Input
//                 id="title"
//                 placeholder="e.g., Dinner at restaurant"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 required
//                 className="border-border/50 bg-input text-foreground placeholder:text-muted-foreground"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="total" className="text-foreground">
//                 Total Amount (₹)
//               </Label>
//               <Input
//                 id="total"
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 placeholder="0.00"
//                 value={total}
//                 onChange={(e) => setTotal(e.target.value)}
//                 required
//                 className="border-border/50 bg-input text-foreground placeholder:text-muted-foreground"
//               />
//             </div>

//             <div className="space-y-3">
//               <div className="flex items-center justify-between gap-2">
//                 <div className="flex items-center gap-2">
//                   <Users className="h-4 w-4 text-muted-foreground" />
//                   <Label className="text-foreground">Participants</Label>
//                 </div>
//                 <div className="relative w-48">
//                   <Input
//                     type="text"
//                     placeholder="Search..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="border-border/50 bg-input pr-8 text-foreground placeholder:text-muted-foreground"
//                   />
//                   <Search className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                 </div>
//               </div>

//               {isLoadingUsers ? (
//                 <div className="flex items-center justify-center py-8">
//                   <Loader2 className="h-6 w-6 animate-spin text-primary" />
//                 </div>
//               ) : filteredUsers.length === 0 ? (
//                 <p className="py-4 text-sm text-muted-foreground">No users found.</p>
//               ) : (
//                 <div className="grid gap-2 sm:grid-cols-2">
//                   {filteredUsers.map((u) => {
//                     const checked = selectedUserIds.includes(u.id);
//                     return (
//                       <div
//                         key={u.id}
//                         role="button"
//                         tabIndex={0}
//                         onClick={() => toggleUser(u.id)}
//                         onKeyDown={(e) => {
//                           if (e.key === 'Enter' || e.key === ' ') {
//                             e.preventDefault();
//                             toggleUser(u.id);
//                           }
//                         }}
//                         className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
//                           checked
//                             ? 'border-primary bg-primary/10'
//                             : 'border-border/50 bg-secondary/30 hover:bg-secondary/50'
//                         }`}
//                       >
//                         {/* Fake checkbox (no Radix, no internal state) */}
//                         <div
//                           className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
//                             checked
//                               ? 'border-primary bg-primary text-primary-foreground'
//                               : 'border-primary/40 bg-transparent'
//                           }`}
//                         >
//                           {checked && <Check className="h-3 w-3" />}
//                         </div>
//                         <div className="overflow-hidden">
//                           <p className="truncate font-medium text-foreground">
//                             {u.username}
//                             {u.id === user?.id && (
//                               <span className="ml-1 text-xs text-primary">(You)</span>
//                             )}
//                           </p>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             <div className="flex gap-3">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => navigate(-1)}
//                 className="flex-1 border-border/50 bg-secondary text-foreground hover:bg-muted"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 disabled={isLoading}
//                 className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
//               >
//                 {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
//                 Create Expense
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { createEvent } from '@/api/events';
import { listUsers, type MinimalUser } from '@/api/users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Receipt, Users, Search, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

const eventSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  total: z.number().positive('Amount must be greater than 0'),
});

export default function EventCreate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [total, setTotal] = useState('');
  const [users, setUsers] = useState<MinimalUser[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await listUsers();
        setUsers(data || []);
        // default: include self if available
        if (user?.id) {
          setSelectedUserIds((prev) =>
            prev.includes(user.id) ? prev : [user.id, ...prev],
          );
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load users');
      } finally {
        setIsLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [user?.id]);

  const toggleUser = (userId: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const totalNum = parseFloat(total);
    const validation = eventSchema.safeParse({ title, total: totalNum });
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    if (Number.isNaN(totalNum)) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (selectedUserIds.length < 2) {
      toast.error('Please select at least 2 participants');
      return;
    }

    if (!user?.id) {
      toast.error('User not loaded. Please try logging in again.');
      return;
    }

    setIsLoading(true);
    try {
      const event = await createEvent({
        title,
        creatorId: user.id,
        total: totalNum,
        participants: selectedUserIds.map((userId) => ({
          userId,
          included: true,
        })),
      });

      toast.success('Expense created successfully!');
      navigate(`/events/${event.id}`);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Failed to create expense');
    } finally {
      setIsLoading(false);
    }
  };

  // users shown in dropdown: not already selected, match search, and (optionally) not self
  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return false;
    if (u.id === user?.id) return false;
    if (selectedUserIds.includes(u.id)) return false;
    const name = (u.username || '').toLowerCase();
    return name.includes(q);
  });

  const selectedOthers = users.filter(
    (u) => u.id !== user?.id && selectedUserIds.includes(u.id),
  );

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card className="border-border/50 bg-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Receipt className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl text-foreground">Create New Expense</CardTitle>
              <CardDescription>Split a bill with your friends</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground">
                Description
              </Label>
              <Input
                id="title"
                placeholder="e.g., Dinner at restaurant"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="border-border/50 bg-input text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="total" className="text-foreground">
                Total Amount (₹)
              </Label>
              <Input
                id="total"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                required
                className="border-border/50 bg-input text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <Label className="text-foreground">Participants</Label>
              </div>

              {/* Self (toggle include/exclude) */}
              {user && (
                <button
                  type="button"
                  onClick={() => toggleUser(user.id)}
                  className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                    selectedUserIds.includes(user.id)
                      ? 'border-primary bg-primary/10'
                      : 'border-border/50 bg-secondary/30 hover:bg-secondary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                        selectedUserIds.includes(user.id)
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border/50 bg-transparent'
                      }`}
                    >
                      {selectedUserIds.includes(user.id) && <Check className="h-3 w-3" />}
                    </div>
                    <p className="font-medium text-foreground">
                      {user.username || user.email}
                      <span className="ml-1 text-xs text-primary">(You)</span>
                    </p>
                  </div>

                  <span className="text-xs text-muted-foreground">
                    {selectedUserIds.includes(user.id) ? 'Included' : 'Not included'}
                  </span>
                </button>
              )}

              {/* Search box to add other participants */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Add other participants by searching their name
                </Label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search user..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-border/50 bg-input pr-8 text-foreground placeholder:text-muted-foreground"
                  />
                  <Search className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  {!isLoadingUsers && searchTerm && (
                    <div className="absolute z-10 mt-1 w-full rounded-md border border-border/50 bg-popover text-sm shadow-lg">
                      {filteredUsers.length === 0 ? (
                        <p className="px-3 py-2 text-xs text-muted-foreground">
                          No users found.
                        </p>
                      ) : (
                        <ul className="max-h-48 overflow-y-auto py-1">
                          {filteredUsers.map((u) => (
                            <li key={u.id}>
                              <button
                                type="button"
                                onClick={() => {
                                  toggleUser(u.id);
                                  setSearchTerm('');
                                }}
                                className="flex w-full items-center justify-between px-3 py-2 text-left text-foreground hover:bg-secondary/60"
                              >
                                <span className="truncate">
                                  {u.username}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Selected other participants */}
              {isLoadingUsers ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Other participants ({selectedOthers.length})
                  </p>
                  {selectedOthers.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      Use the search above to add more people.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedOthers.map((u) => (
                        <button
                          type="button"
                          key={u.id}
                          onClick={() => toggleUser(u.id)}
                          className="flex items-center gap-1 rounded-full border border-border/60 bg-secondary/40 px-3 py-1 text-xs text-foreground hover:bg-secondary/70"
                        >
                          <span className="truncate max-w-[120px]">
                            {u.username}
                          </span>
                          <X className="h-3 w-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1 border-border/50 bg-secondary text-foreground hover:bg-muted"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create Expense
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
