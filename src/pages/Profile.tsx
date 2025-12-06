import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateUser } from '@/api/users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const { user, updateUser: updateAuthUser } = useAuth();
  const [username, setUsername] = useState(user?.name || user?.username || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setIsLoading(true);
    try {
      const updated = await updateUser(user!.id, { username: username.trim() });
      updateAuthUser({ ...user!, name: updated.username || updated.name, username: updated.username });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl animate-fade-in">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Profile</h1>

      <Card className="border-border/50 bg-card">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl text-foreground">{user?.name || user?.username}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {user?.email}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">
                Display Name
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-border/50 bg-input text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                className="border-border/50 bg-muted text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6 border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Account Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-secondary/30 p-4">
              <p className="text-sm text-muted-foreground">Total Balance</p>
              <p className="text-2xl font-bold text-foreground">${(user?.total || 0).toFixed(2)}</p>
            </div>
            <div className="rounded-lg bg-secondary/30 p-4">
              <p className="text-sm text-muted-foreground">Events</p>
              <p className="text-2xl font-bold text-foreground">{user?.events?.length || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
