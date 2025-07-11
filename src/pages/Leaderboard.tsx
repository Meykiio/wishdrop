
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Crown, Heart, Star, Award, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { LoadingSpinner } from '@/components/LoadingSpinner';

type LeaderboardUser = Tables<'profiles'> & {
  donation_count?: number;
  donation_total?: number;
  badge_count?: number;
  wish_count?: number;
  fulfilled_wishes?: number;
};

const Leaderboard = () => {
  const [topDonors, setTopDonors] = useState<LeaderboardUser[]>([]);
  const [topKarma, setTopKarma] = useState<LeaderboardUser[]>([]);
  const [topWishers, setTopWishers] = useState<LeaderboardUser[]>([]);
  const [topBadgeHolders, setTopBadgeHolders] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      // Top donors by donation amount
      const { data: donors } = await supabase
        .from('profiles')
        .select(`
          *,
          donations!inner(amount, status)
        `)
        .order('karma', { ascending: false })
        .limit(10);

      // Process donors data
      const processedDonors = donors?.map(user => ({
        ...user,
        donation_total: user.donations?.reduce((sum: number, d: any) => 
          d.status === 'completed' ? sum + d.amount : sum, 0) || 0,
        donation_count: user.donations?.filter((d: any) => d.status === 'completed').length || 0,
      })).sort((a, b) => (b.donation_total || 0) - (a.donation_total || 0)) || [];

      setTopDonors(processedDonors);

      // Top karma users
      const { data: karmaUsers } = await supabase
        .from('profiles')
        .select('*')
        .order('karma', { ascending: false })
        .limit(10);

      setTopKarma(karmaUsers || []);

      // Top wishers (users with most wishes)
      const { data: wishers } = await supabase
        .from('profiles')
        .select(`
          *,
          wishes!inner(id, status)
        `)
        .limit(10);

      const processedWishers = wishers?.map(user => ({
        ...user,
        wish_count: user.wishes?.length || 0,
        fulfilled_wishes: user.wishes?.filter((w: any) => w.status === 'funded').length || 0,
      })).sort((a, b) => (b.wish_count || 0) - (a.wish_count || 0)) || [];

      setTopWishers(processedWishers);

      // Top badge holders
      const { data: badgeHolders } = await supabase
        .from('profiles')
        .select(`
          *,
          user_badges!inner(id)
        `)
        .limit(10);

      const processedBadgeHolders = badgeHolders?.map(user => ({
        ...user,
        badge_count: user.user_badges?.length || 0,
      })).sort((a, b) => (b.badge_count || 0) - (a.badge_count || 0)) || [];

      setTopBadgeHolders(processedBadgeHolders);

    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Trophy className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Trophy className="h-5 w-5 text-orange-500" />;
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  };

  const LeaderboardCard = ({ 
    users, 
    title, 
    icon, 
    metricKey,
    metricFormatter 
  }: { 
    users: LeaderboardUser[], 
    title: string, 
    icon: React.ReactNode,
    metricKey: keyof LeaderboardUser,
    metricFormatter?: (value: any) => string
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user, index) => (
            <div key={user.id} className="flex items-center gap-4">
              <div className="flex-shrink-0 w-8 flex justify-center">
                {getRankIcon(index + 1)}
              </div>
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.profile_pic || ''} />
                <AvatarFallback>
                  {user.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user.name || 'Anonymous'}</p>
                <p className="text-sm text-muted-foreground">
                  {metricFormatter ? 
                    metricFormatter(user[metricKey]) : 
                    String(user[metricKey] || 0)
                  }
                </p>
              </div>
              {index < 3 && (
                <Badge variant={index === 0 ? 'default' : 'secondary'}>
                  {index === 0 ? '🏆' : index === 1 ? '🥈' : '🥉'}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Leaderboard</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Celebrating our most generous donors and active community members
        </p>
      </div>

      <Tabs defaultValue="karma" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="karma">
            <Star className="h-4 w-4 mr-2" />
            Top Karma
          </TabsTrigger>
          <TabsTrigger value="donors">
            <Heart className="h-4 w-4 mr-2" />
            Top Donors
          </TabsTrigger>
          <TabsTrigger value="wishers">
            <Users className="h-4 w-4 mr-2" />
            Active Wishers
          </TabsTrigger>
          <TabsTrigger value="badges">
            <Award className="h-4 w-4 mr-2" />
            Badge Collectors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="karma" className="mt-6">
          <LeaderboardCard
            users={topKarma}
            title="Highest Karma Score"
            icon={<Star className="h-5 w-5 text-yellow-500" />}
            metricKey="karma"
            metricFormatter={(karma) => `${karma || 0} karma`}
          />
        </TabsContent>

        <TabsContent value="donors" className="mt-6">
          <LeaderboardCard
            users={topDonors}
            title="Most Generous Donors"
            icon={<Heart className="h-5 w-5 text-red-500" />}
            metricKey="donation_total"
            metricFormatter={(total) => `$${((total || 0) / 100).toFixed(2)} donated`}
          />
        </TabsContent>

        <TabsContent value="wishers" className="mt-6">
          <LeaderboardCard
            users={topWishers}
            title="Most Active Wishers"
            icon={<Users className="h-5 w-5 text-blue-500" />}
            metricKey="wish_count"
            metricFormatter={(count) => `${count || 0} wishes created`}
          />
        </TabsContent>

        <TabsContent value="badges" className="mt-6">
          <LeaderboardCard
            users={topBadgeHolders}
            title="Top Badge Collectors"
            icon={<Award className="h-5 w-5 text-purple-500" />}
            metricKey="badge_count"
            metricFormatter={(count) => `${count || 0} badges earned`}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Leaderboard;
