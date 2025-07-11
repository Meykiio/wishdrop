
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Heart, Star, Crown, Award, Zap } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type BadgeWithUserBadge = Tables<'badges'> & {
  user_badges?: Tables<'user_badges'>[];
  earned_at?: string;
  reason?: string;
};

interface BadgeDisplayProps {
  badges: BadgeWithUserBadge[];
  showEarned?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const getBadgeIcon = (iconName: string) => {
  const iconMap: Record<string, React.ComponentType<any>> = {
    trophy: Trophy,
    heart: Heart,
    star: Star,
    crown: Crown,
    award: Award,
    zap: Zap,
  };
  
  const IconComponent = iconMap[iconName.toLowerCase()] || Award;
  return IconComponent;
};

export const BadgeDisplay = ({ badges, showEarned = false, size = 'md' }: BadgeDisplayProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const earnedBadges = showEarned ? badges.filter(badge => badge.user_badges && badge.user_badges.length > 0) : badges;

  if (earnedBadges.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {showEarned ? 'No badges earned yet' : 'No badges available'}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {earnedBadges.map((badge) => {
        const IconComponent = getBadgeIcon(badge.icon);
        const isEarned = badge.user_badges && badge.user_badges.length > 0;
        
        return (
          <Card key={badge.id} className={`text-center transition-all ${isEarned ? 'ring-2 ring-yellow-400' : 'opacity-50'}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-center">
                <IconComponent 
                  className={`${sizeClasses[size]} ${isEarned ? 'text-yellow-500' : 'text-gray-400'}`} 
                />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardTitle className="text-sm font-medium">{badge.name}</CardTitle>
              {badge.description && (
                <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
              )}
              {isEarned && badge.earned_at && (
                <Badge variant="secondary" className="mt-2 text-xs">
                  Earned {new Date(badge.earned_at).toLocaleDateString()}
                </Badge>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
