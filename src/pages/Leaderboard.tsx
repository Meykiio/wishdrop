
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Crown, Heart, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type LeaderboardUser = Tables<'profiles'> & {
  donation_count?: number;
  donation_total?: number;
  badge_count?: number;
};

const Leaderboard = () => {
  const [topDonors, setTopDonors] = useState<LeaderboardUser[]>([]);
  const [topKarma, setTopKarma] = useState<LeaderboardUser[]>([]);
  const [topWishers, setTopWishers] = useState<LeaderboardUser[]>([]);
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
          donations!inner(amount)
        `)
        .order('karma', { ascending: false })
        .limit(10);

      // Process donors data
      const processedDonors = donors?.map(user => ({
        ...user,
        donation_total: user.donations?.reduce((sum: number, d: any) => sum + d.amount, 0) || 0,
        donation_count: user.donations?.length || 0,
      })) || [];

      setTopDonors(processedDonors);

      // Top karma users
      const { data: karmaUsers } = await supabase
        .from('profiles')
        .select('*')
        .order('karma', { ascending: false })
        .limit(10);

      setTopKarma(karmaUsers || []);

      // Top wishers (users with most fulfilled wishes)
      const { data: wishers } = await supabase
        .from('profiles')
        .select(`
          *,
          wishes!inner(id, status)
        `)
        .limit(10);

      setTopWishers(wishers || []);
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
    metricKey 
  }: { 
    users: LeaderboardUser[], 
    title: string, 
    icon: React.ReactNode,
    metricKey: keyof LeaderboardUser
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
                  {metricKey === 'karma' && `${user.karma || 0} karma`}
                  {metricKey === 'donation_total' && `$${((user.donation_total || 0) / 100).toFixed(2)} donated`}
                  {metricKey === 'donation_count' && `${user.donation_count || 0} donations`}
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
        <div className="text-center">Loading leaderboard...</div>
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="karma">
            <Star className="h-4 w-4 mr-2" />
            Top Karma
          </TabsTrigger>
          <TabsTrigger value="donors">
            <Heart className="h-4 w-4 mr-2" />
            Top Donors
          </TabsTrigger>
          <TabsTrigger value="wishers">
            <Trophy className="h-4 w-4 mr-2" />
            Active Wishers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="karma" className="mt-6">
          <LeaderboardCard
            users={topKarma}
            title="Highest Karma Score"
            icon={<Star className="h-5 w-5 text-yellow-500" />}
            metricKey="karma"
          />
        </TabsContent>

        <TabsContent value="donors" className="mt-6">
          <LeaderboardCard
            users={topDonors}
            title="Most Generous Donors"
            icon={<Heart className="h-5 w-5 text-red-500" />}
            metricKey="donation_total"
          />
        </TabsContent>

        <TabsContent value="wishers" className="mt-6">
          <LeaderboardCard
            users={topWishers}
            title="Most Active Wishers"
            icon={<Trophy className="h-5 w-5 text-blue-500" />}
            metricKey="donation_count"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Leaderboard;
