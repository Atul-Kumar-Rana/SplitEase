import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { login as loginApi } from '@/api/auth';
import { getCurrentUser } from '@/api/users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Wallet,
  Loader2,
  Eye,
  EyeOff,
  Users,
  PieChart,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    try {
      // call backend
      const { token } = await loginApi({ email, password });

      // if success → fetch user + login
      const user = await getCurrentUser();
      login(token, user);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err: any) {
      const apiError = err?.response?.data?.error;

      if (apiError === 'email_not_verified') {
        toast.error('Email not verified. Please check your inbox 📩');
      } else if (apiError === 'invalid_credentials') {
        toast.error('Invalid email or password.');
      } else {
        toast.error(
          err instanceof Error
            ? err.message
            : 'Login failed. Please check your credentials.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="grid w-full max-w-6xl gap-10 rounded-3xl border border-border/40 bg-gradient-to-br from-background via-background/95 to-background/80 p-6 shadow-xl shadow-black/40 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.1fr)] md:p-10 lg:p-12">
        {/* LEFT: SplitEase info / visuals */}
        <div className="relative hidden items-center md:flex">
          {/* glow blobs */}
          <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-0 h-56 w-56 rounded-full bg-emerald-500/15 blur-3xl" />

          <div className="relative w-full rounded-3xl border border-border/40 bg-gradient-to-br from-card/90 via-card/70 to-background/60 p-7 shadow-lg shadow-black/40">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3" />
              Smart expense splitting, simplified.
            </div>

            <h2 className="text-2xl font-bold leading-tight text-foreground md:text-3xl">
              SplitEase keeps your
              <span className="text-primary"> group expenses</span> fair,
              transparent, and stress-free.
            </h2>

            <p className="mt-3 text-sm text-muted-foreground md:text-[0.92rem]">
              Add expenses, choose who joined, and let SplitEase calculate
              everyone&apos;s share instantly. No more awkward{' '}
              <span className="font-semibold text-foreground">
                &quot;Who owes what?&quot;
              </span>{' '}
              conversations.
            </p>

            {/* Feature cards */}
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <div className="flex gap-3 rounded-2xl border border-border/40 bg-background/60 p-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/15">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Track groups & trips
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Perfect for friends, roommates, and travel squads.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 rounded-2xl border border-border/40 bg-background/60 p-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15">
                  <PieChart className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Smart split engine
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Split equally or customize shares in seconds.
                  </p>
                </div>
              </div>
            </div>

            {/* Small stats visual */}
            <div className="mt-6 grid gap-3 text-xs text-muted-foreground md:grid-cols-[1.2fr_1fr]">
              <div className="rounded-2xl border border-border/40 bg-background/70 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[0.7rem] uppercase tracking-wide text-muted-foreground">
                    This month
                  </span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.7rem] text-emerald-400">
                    Settle up faster
                  </span>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-[0.75rem] text-muted-foreground">
                      You are owed
                    </p>
                    <p className="text-lg font-semibold text-emerald-400">
                      ₹2,350
                    </p>
                  </div>
                  <div>
                    <p className="text-[0.75rem] text-muted-foreground">
                      You owe
                    </p>
                    <p className="text-lg font-semibold text-rose-400">
                      ₹540
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[0.7rem]">
                  <span>3 friends need to settle.</span>
                  <span className="inline-flex items-center gap-1 text-primary">
                    View dashboard
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-3">
                <p className="text-[0.8rem] text-muted-foreground">
                  Built for{' '}
                  <span className="font-semibold text-foreground">
                    students, trips, and daily life
                  </span>
                  . One place for all shared expenses.
                </p>
                <p className="mt-2 text-[0.75rem] text-primary/90">
                  Log in and create your first expense in under a minute.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Login form */}
        <div className="flex flex-col justify-center">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 shadow-[0_0_25px_rgba(56,189,248,0.35)]">
              <Wallet className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary/80">
                SplitEase
              </p>
              <h1 className="text-2xl font-semibold leading-snug">
                Log in &amp; keep every
                <span className="text-primary"> rupee</span> tracked.
              </h1>
            </div>
          </div>

          <Card className="border-border/60 bg-card/95 backdrop-blur">
            <CardHeader className="text-left">
              <CardTitle className="text-xl text-foreground">
                Welcome back
              </CardTitle>
              <CardDescription>Sign in to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-border/50 bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-border/50 bg-input pr-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 w-full bg-primary text-primary-foreground shadow-[0_0_22px_rgba(56,189,248,0.45)] hover:bg-primary/90"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Sign In
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link
                  to="/signup"
                  className="font-medium text-primary hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '@/context/AuthContext';
// import { login as loginApi } from '@/api/auth';
// import { getCurrentUser } from '@/api/users';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import {
//   Wallet,
//   Loader2,
//   Eye,
//   EyeOff,
//   Users,
//   PieChart,
//   Sparkles,
//   ArrowRight,
// } from 'lucide-react';
// import { toast } from 'sonner';
// import { z } from 'zod';

// const loginSchema = z.object({
//   email: z.string().email('Please enter a valid email'),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
// });

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const validation = loginSchema.safeParse({ email, password });
//     if (!validation.success) {
//       toast.error(validation.error.errors[0].message);
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const { token } = await loginApi({ email, password });
//       const user = await getCurrentUser();
//       login(token, user);
//       toast.success('Welcome back!');
//       navigate('/dashboard');
//     } catch (error) {
//       toast.error(
//         error instanceof Error
//           ? error.message
//           : 'Login failed. Please check your credentials.'
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
//       <div className="grid w-full max-w-6xl gap-10 rounded-3xl border border-border/40 bg-gradient-to-br from-background via-background/95 to-background/80 p-6 shadow-xl shadow-black/40 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.1fr)] md:p-10 lg:p-12">
//         {/* LEFT: SplitEase info / visuals */}
//         <div className="relative hidden items-center md:flex">
//           {/* glow blobs */}
//           <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
//           <div className="pointer-events-none absolute -bottom-20 left-0 h-56 w-56 rounded-full bg-emerald-500/15 blur-3xl" />

//           <div className="relative w-full rounded-3xl border border-border/40 bg-gradient-to-br from-card/90 via-card/70 to-background/60 p-7 shadow-lg shadow-black/40">
//             <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
//               <Sparkles className="h-3 w-3" />
//               Smart expense splitting, simplified.
//             </div>

//             <h2 className="text-2xl font-bold leading-tight text-foreground md:text-3xl">
//               SplitEase keeps your
//               <span className="text-primary"> group expenses</span> fair,
//               transparent, and stress-free.
//             </h2>

//             <p className="mt-3 text-sm text-muted-foreground md:text-[0.92rem]">
//               Add expenses, choose who joined, and let SplitEase calculate
//               everyone&apos;s share instantly. No more awkward{' '}
//               <span className="font-semibold text-foreground">
//                 &quot;Who owes what?&quot;
//               </span>{' '}
//               conversations.
//             </p>

//             {/* Feature cards */}
//             <div className="mt-6 grid gap-3 md:grid-cols-2">
//               <div className="flex gap-3 rounded-2xl border border-border/40 bg-background/60 p-3">
//                 <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/15">
//                   <Users className="h-4 w-4 text-primary" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-semibold text-foreground">
//                     Track groups & trips
//                   </p>
//                   <p className="text-xs text-muted-foreground">
//                     Perfect for friends, roommates, and travel squads.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex gap-3 rounded-2xl border border-border/40 bg-background/60 p-3">
//                 <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15">
//                   <PieChart className="h-4 w-4 text-emerald-400" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-semibold text-foreground">
//                     Smart split engine
//                   </p>
//                   <p className="text-xs text-muted-foreground">
//                     Split equally or customize shares in seconds.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Small stats visual */}
//             <div className="mt-6 grid gap-3 text-xs text-muted-foreground md:grid-cols-[1.2fr_1fr]">
//               <div className="rounded-2xl border border-border/40 bg-background/70 p-3">
//                 <div className="flex items-center justify-between">
//                   <span className="text-[0.7rem] uppercase tracking-wide text-muted-foreground">
//                     This month
//                   </span>
//                   <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.7rem] text-emerald-400">
//                     Settle up faster
//                   </span>
//                 </div>
//                 <div className="mt-3 flex items-end justify-between">
//                   <div>
//                     <p className="text-[0.75rem] text-muted-foreground">
//                       You are owed
//                     </p>
//                     <p className="text-lg font-semibold text-emerald-400">
//                       ₹2,350
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-[0.75rem] text-muted-foreground">
//                       You owe
//                     </p>
//                     <p className="text-lg font-semibold text-rose-400">
//                       ₹540
//                     </p>
//                   </div>
//                 </div>
//                 <div className="mt-3 flex items-center justify-between text-[0.7rem]">
//                   <span>3 friends need to settle.</span>
//                   <span className="inline-flex items-center gap-1 text-primary">
//                     View dashboard
//                     <ArrowRight className="h-3 w-3" />
//                   </span>
//                 </div>
//               </div>

//               <div className="flex flex-col justify-between rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-3">
//                 <p className="text-[0.8rem] text-muted-foreground">
//                   Built for{' '}
//                   <span className="font-semibold text-foreground">
//                     students, trips, and daily life
//                   </span>
//                   . One place for all shared expenses.
//                 </p>
//                 <p className="mt-2 text-[0.75rem] text-primary/90">
//                   Log in and create your first expense in under a minute.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT: Login form */}
//         <div className="flex flex-col justify-center">
//           <div className="mb-8 flex items-center gap-3">
//             <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 shadow-[0_0_25px_rgba(56,189,248,0.35)]">
//               <Wallet className="h-7 w-7 text-primary" />
//             </div>
//             <div>
//               <p className="text-xs uppercase tracking-[0.2em] text-primary/80">
//                 SplitEase
//               </p>
//               <h1 className="text-2xl font-semibold leading-snug">
//                 Log in &amp; keep every
//                 <span className="text-primary"> rupee</span> tracked.
//               </h1>
//             </div>
//           </div>

//           <Card className="border-border/60 bg-card/95 backdrop-blur">
//             <CardHeader className="text-left">
//               <CardTitle className="text-xl text-foreground">
//                 Welcome back
//               </CardTitle>
//               <CardDescription>
//                 Sign in to your account
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="email" className="text-foreground">
//                     Email
//                   </Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="you@example.com"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     className="border-border/50 bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="password" className="text-foreground">
//                     Password
//                   </Label>
//                   <div className="relative">
//                     <Input
//                       id="password"
//                       type={showPassword ? 'text' : 'password'}
//                       placeholder="••••••••"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       required
//                       className="border-border/50 bg-input pr-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//                     >
//                       {showPassword ? (
//                         <EyeOff className="h-4 w-4" />
//                       ) : (
//                         <Eye className="h-4 w-4" />
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 <Button
//                   type="submit"
//                   disabled={isLoading}
//                   className="mt-2 w-full bg-primary text-primary-foreground shadow-[0_0_22px_rgba(56,189,248,0.45)] hover:bg-primary/90"
//                 >
//                   {isLoading ? (
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   ) : null}
//                   Sign In
//                 </Button>
//               </form>

//               <p className="mt-6 text-center text-sm text-muted-foreground">
//                 Don&apos;t have an account?{' '}
//                 <Link
//                   to="/signup"
//                   className="font-medium text-primary hover:underline"
//                 >
//                   Sign up
//                 </Link>
//               </p>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }


// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '@/context/AuthContext';
// import { login as loginApi } from '@/api/auth';
// import { getCurrentUser } from '@/api/users';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Wallet, Loader2, Eye, EyeOff } from 'lucide-react';
// import { toast } from 'sonner';
// import { z } from 'zod';

// const loginSchema = z.object({
//   email: z.string().email('Please enter a valid email'),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
// });

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const validation = loginSchema.safeParse({ email, password });
//     if (!validation.success) {
//       toast.error(validation.error.errors[0].message);
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // 1) Login – backend returns only token, loginApi saves it in localStorage
//       const { token } = await loginApi({ email, password });

//       // 2) Fetch current user using that token
//       const user = await getCurrentUser();

//       // 3) Save token + user into AuthContext
//       login(token, user);

//       // 4) Notify + go to dashboard
//       toast.success('Welcome back!');
//       navigate('/dashboard');
//       // if it still bounces for some reason, you can temporarily use:
//       // window.location.href = '/dashboard';
//     } catch (error) {
//       toast.error(
//         error instanceof Error ? error.message : 'Login failed. Please check your credentials.'
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-background px-4">
//       <div className="w-full max-w-md animate-fade-in">
//         <div className="mb-8 flex flex-col items-center">
//           <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 glow-accent">
//             <Wallet className="h-8 w-8 text-primary" />
//           </div>
//           <h1 className="text-3xl font-bold text-foreground">SplitEase</h1>
//           <p className="mt-2 text-muted-foreground">Split expenses with friends, effortlessly</p>
//         </div>

//         <Card className="border-border/50 bg-card">
//           <CardHeader className="text-center">
//             <CardTitle className="text-xl text-foreground">Welcome back</CardTitle>
//             <CardDescription>Sign in to your account</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="email" className="text-foreground">
//                   Email
//                 </Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="you@example.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="border-border/50 bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="password" className="text-foreground">
//                   Password
//                 </Label>
//                 <div className="relative">
//                   <Input
//                     id="password"
//                     type={showPassword ? 'text' : 'password'}
//                     placeholder="••••••••"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     className="border-border/50 bg-input pr-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//                   >
//                     {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   </button>
//                 </div>
//               </div>
//               <Button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
//               >
//                 {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
//                 Sign In
//               </Button>
//             </form>
//             <p className="mt-6 text-center text-sm text-muted-foreground">
//               Don't have an account{' '}
//               <Link to="/signup" className="font-medium text-primary hover:underline">
//                 Sign up
//               </Link>
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
