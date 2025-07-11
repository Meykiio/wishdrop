
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Tables } from '@/integrations/supabase/types';

export const useBadgeNotifications = () => {
  const [notifications, setNotifications] = useState<Tables<'badges'>[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const checkForNewBadges = async () => {
      try {
        const { data: recentBadges, error } = await supabase
          .from('user_badges')
          .select(`
            *,
            badges (*)
          `)
          .eq('user_id', user.id)
          .gte('earned_at', new Date(Date.now() - 60000).toISOString()) // Last minute
          .order('earned_at', { ascending: false });

        if (error) {
          console.error('Error checking for new badges:', error);
          return;
        }

        if (recentBadges && recentBadges.length > 0) {
          const newBadges = recentBadges
            .map(ub => ub.badges)
            .filter(badge => badge !== null) as Tables<'badges'>[];
          
          setNotifications(prev => [...prev, ...newBadges]);
        }
      } catch (error) {
        console.error('Error in badge notification check:', error);
      }
    };

    // Check immediately and then every 30 seconds
    checkForNewBadges();
    const interval = setInterval(checkForNewBadges, 30000);

    return () => clearInterval(interval);
  }, [user]);

  const dismissNotification = (badgeId: string) => {
    setNotifications(prev => prev.filter(badge => badge.id !== badgeId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    dismissNotification,
    clearAllNotifications
  };
};
