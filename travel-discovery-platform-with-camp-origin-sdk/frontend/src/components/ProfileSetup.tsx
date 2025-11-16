import { useState } from 'react';
import { useOrigin } from '../hooks/useOrigin';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileSetup() {
  const { isConnected } = useOrigin();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [travelStyle, setTravelStyle] = useState('adventure');

  const showProfileSetup = isConnected && !profileLoading && isFetched && userProfile === null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    saveProfile(
      {
        name: name.trim(),
        email: email.trim(),
        preferences: {
          favoriteDestinations: [],
          travelStyle,
        },
      },
      {
        onSuccess: () => {
          toast.success('Profile created successfully! Start exploring destinations.');
        },
        onError: (error) => {
          toast.error(`Failed to create profile: ${error.message}`);
        },
      }
    );
  };

  return (
    <Dialog open={showProfileSetup}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome to TravelDiscover</DialogTitle>
          <DialogDescription>
            Set up your travel profile to get personalized destination recommendations.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="travelStyle">Travel Style</Label>
            <Select value={travelStyle} onValueChange={setTravelStyle} disabled={isPending}>
              <SelectTrigger id="travelStyle">
                <SelectValue placeholder="Select your travel style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="relaxation">Relaxation</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="family">Family</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Help us recommend destinations that match your travel preferences
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Profile...
              </>
            ) : (
              'Start Exploring'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
