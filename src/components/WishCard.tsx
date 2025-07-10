
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MapPin, Clock, DollarSign } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { formatDistanceToNow } from 'date-fns';
import { DonationModal } from './DonationModal';

type Wish = Tables<'wishes'> & {
  profiles: Tables<'profiles'>;
  donations: { amount: number }[];
};

interface WishCardProps {
  wish: Wish;
}

export const WishCard = ({ wish }: WishCardProps) => {
  const [showDonationModal, setShowDonationModal] = useState(false);
  
  const totalDonated = wish.donations?.reduce((sum, donation) => sum + donation.amount, 0) || 0;
  const progressPercentage = Math.min((totalDonated / wish.amount) * 100, 100);
  const timeLeft = formatDistanceToNow(new Date(wish.expires_at), { addSuffix: true });
  
  const getCategoryColor = (category: string) => {
    const colors = {
      education: 'bg-blue-100 text-blue-800',
      medical: 'bg-red-100 text-red-800',
      family: 'bg-green-100 text-green-800',
      emergency: 'bg-orange-100 text-orange-800',
      technology: 'bg-purple-100 text-purple-800',
      community: 'bg-yellow-100 text-yellow-800',
      pet_care: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    };
    return colors[urgency as keyof typeof colors] || colors.medium;
  };

  return (
    <>
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <Badge className={getCategoryColor(wish.category)}>
              {wish.category.replace('_', ' ')}
            </Badge>
            <Badge variant="outline" className={getUrgencyColor(wish.urgency)}>
              {wish.urgency}
            </Badge>
          </div>
          <h3 className="font-semibold text-lg line-clamp-2">{wish.title}</h3>
        </CardHeader>
        
        <CardContent className="pb-3">
          {wish.media_url && (
            <img
              src={wish.media_url}
              alt={wish.title}
              className="w-full h-48 object-cover rounded-md mb-3"
            />
          )}
          
          <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
            {wish.description}
          </p>
          
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-6 w-6">
              <AvatarImage src={wish.profiles.profile_pic || ''} />
              <AvatarFallback className="text-xs">
                {wish.profiles.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {wish.profiles.name || 'Anonymous'}
            </span>
          </div>
          
          {wish.location && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
              <MapPin className="h-4 w-4" />
              <span>{wish.location}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                ${(totalDonated / 100).toFixed(2)} / ${(wish.amount / 100).toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
            <Clock className="h-4 w-4" />
            <span>Expires {timeLeft}</span>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button
            onClick={() => setShowDonationModal(true)}
            className="w-full"
            disabled={wish.status !== 'pending'}
          >
            <Heart className="h-4 w-4 mr-2" />
            {wish.status === 'funded' ? 'Funded' : 'Fulfill Wish'}
          </Button>
        </CardFooter>
      </Card>
      
      <DonationModal
        wish={wish}
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
      />
    </>
  );
};
