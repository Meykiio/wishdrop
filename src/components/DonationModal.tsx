
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, DollarSign } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type Wish = Tables<'wishes'> & {
  profiles: Tables<'profiles'>;
};

interface DonationModalProps {
  wish: Wish;
  isOpen: boolean;
  onClose: () => void;
}

export const DonationModal = ({ wish, isOpen, onClose }: DonationModalProps) => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleDonate = async () => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to make a donation.',
        variant: 'destructive',
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid donation amount.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // For now, we'll create a donation record directly
      // In production, this would go through Stripe first
      const { error } = await supabase.from('donations').insert({
        wish_id: wish.id,
        donor_id: user.id,
        amount: Math.round(parseFloat(amount) * 100), // Convert to cents
        is_anonymous: isAnonymous,
        message: message || null,
        status: 'completed', // In production, this would be 'pending' until Stripe confirms
      });

      if (error) throw error;

      toast({
        title: 'Thank you!',
        description: 'Your donation has been processed successfully.',
      });

      onClose();
      setAmount('');
      setMessage('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Fulfill This Wish
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={wish.profiles.profile_pic || ''} />
                <AvatarFallback>
                  {wish.profiles.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{wish.title}</p>
                <p className="text-sm text-muted-foreground">
                  by {wish.profiles.name || 'Anonymous'}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Goal: ${(wish.amount / 100).toFixed(2)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Donation Amount ($)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10"
                min="0.01"
                step="0.01"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Optional Message</Label>
            <Textarea
              id="message"
              placeholder="Leave an encouraging message for the wisher..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
            <Label htmlFor="anonymous">Donate anonymously</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleDonate} disabled={loading} className="flex-1">
              {loading ? 'Processing...' : 'Donate'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
