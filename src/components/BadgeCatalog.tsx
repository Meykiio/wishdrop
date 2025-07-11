
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { BadgeDisplay } from './BadgeDisplay';
import { LoadingSpinner } from './LoadingSpinner';
import { Tables } from '@/integrations/supabase/types';

type BadgeWithUserBadge = Tables<'badges'> & {
  user_badges?: Tables<'user_badges'>[];
  earned_at?: string;
  reason?: string;
};

export const BadgeCatalog = () => {
  const [badges, setBadges] = useState<BadgeWithUserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchBadges();
  }, [user]);

  const fetchBadges = async () => {
    try {
      let query = supabase
        .from('badges')
        .select('*');

      if (user) {
        query = supabase
          .from('badges')
          .select(`
            *,
            user_badges!left(
              id,
              earned_at,
              reason
            )
          `)
          .eq('user_badges.user_id', user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching badges:', error);
        return;
      }

      setBadges(data || []);
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  const earnedBadges = badges.filter(badge => badge.user_badges && badge.user_badges.length > 0);
  const availableBadges = badges.filter(badge => !badge.user_badges || badge.user_badges.length === 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Badge Collection</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Earn badges by being an active member of the WishDrop community
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="all">
            All Badges ({badges.length})
          </TabsTrigger>
          <TabsTrigger value="earned">
            Earned ({earnedBadges.length})
          </TabsTrigger>
          <TabsTrigger value="available">
            Available ({availableBadges.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <BadgeDisplay badges={badges} />
        </TabsContent>

        <TabsContent value="earned">
          <BadgeDisplay badges={earnedBadges} showEarned={true} />
        </TabsContent>

        <TabsContent value="available">
          <BadgeDisplay badges={availableBadges} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
