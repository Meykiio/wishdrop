
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit3, Star, Trophy, Heart, Gift } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';

type UserBadge = Tables<'user_badges'> & {
  badges: Tables<'badges'>;
};

type UserWish = Tables<'wishes'>;
type UserDonation = Tables<'donations'> & {
  wishes: Tables<'wishes'>;
};

export const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [userWishes, setUserWishes] = useState<UserWish[]>([]);
  const [userDonations, setUserDonations] = useState<UserDonation[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setBio(profile.bio || '');
      setLocation(profile.location || '');
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch user badges
      const { data: badges } = await supabase
        .from('user_badges')
        .select('*, badges(*)')
        .eq('user_id', user.id);
      
      setUserBadges(badges || []);

      // Fetch user wishes
      const { data: wishes } = await supabase
        .from('wishes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      setUserWishes(wishes || []);

      // Fetch user donations
      const { data: donations } = await supabase
        .from('donations')
        .select('*, wishes(*)')
        .eq('donor_id', user.id)
        .order('created_at', { ascending: false });
      
      setUserDonations(donations || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({
        name,
        bio,
        location,
      });
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
      
      setIsEditing(false);
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

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.profile_pic || ''} />
                <AvatarFallback className="text-lg">
                  {profile.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{profile.name || 'User'}</h1>
                <p className="text-muted-foreground">{profile.email}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{profile.karma || 0}</span>
                    <span className="text-sm text-muted-foreground">karma</span>
                  </div>
                  <Badge variant="outline">
                    {profile.role}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        
        {isEditing && (
          <CardContent className="border-t pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, State/Country"
                />
              </div>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Badges */}
      {userBadges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Badges ({userBadges.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {userBadges.map((userBadge) => (
                <div
                  key={userBadge.id}
                  className="text-center p-3 border rounded-lg"
                >
                  <div className="text-2xl mb-2">{userBadge.badges.icon}</div>
                  <div className="font-medium text-sm">{userBadge.badges.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {userBadge.badges.description}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs for Wishes and Donations */}
      <Tabs defaultValue="wishes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="wishes" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            My Wishes ({userWishes.length})
          </TabsTrigger>
          <TabsTrigger value="donations" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            My Donations ({userDonations.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="wishes" className="space-y-4">
          {userWishes.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  You haven't created any wishes yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            userWishes.map((wish) => (
              <Card key={wish.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{wish.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {wish.description.substring(0, 100)}...
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant={wish.status === 'pending' ? 'default' : 'secondary'}>
                          {wish.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          ${(wish.amount / 100).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="donations" className="space-y-4">
          {userDonations.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  You haven't made any donations yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            userDonations.map((donation) => (
              <Card key={donation.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{donation.wishes.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Donated ${(donation.amount / 100).toFixed(2)}
                      </p>
                      {donation.message && (
                        <p className="text-sm mt-1 italic">"{donation.message}"</p>
                      )}
                    </div>
                    <Badge variant={donation.is_anonymous ? 'secondary' : 'default'}>
                      {donation.is_anonymous ? 'Anonymous' : 'Public'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
