
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Edit3, Star, User, Heart, Gift, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<'wisher' | 'donor' | 'admin'>('wisher');
  const [loading, setLoading] = useState(false);
  
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setRole(profile.role || 'wisher');
    }
  }, [profile]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({
        name,
        role,
      });
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
      
      setIsEditing(false);
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const getRoleIcon = (userRole: string) => {
    switch (userRole) {
      case 'donor':
        return <Gift className="h-3 w-3 mr-1" />;
      case 'admin':
        return <Shield className="h-3 w-3 mr-1" />;
      default:
        return <Heart className="h-3 w-3 mr-1" />;
    }
  };

  const getRoleLabel = (userRole: string) => {
    switch (userRole) {
      case 'donor':
        return 'Donor';
      case 'admin':
        return 'Admin';
      default:
        return 'Wisher';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Basic Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
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
                  <Badge variant={profile.role === 'donor' ? 'default' : profile.role === 'admin' ? 'destructive' : 'secondary'}>
                    {getRoleIcon(profile.role || 'wisher')}
                    {getRoleLabel(profile.role || 'wisher')}
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
                  placeholder="Enter your name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">I am primarily a...</Label>
                <Select value={role} onValueChange={(value: 'wisher' | 'donor' | 'admin') => setRole(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wisher">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-2" />
                        Wisher - I make wishes for help
                      </div>
                    </SelectItem>
                    <SelectItem value="donor">
                      <div className="flex items-center">
                        <Gift className="h-4 w-4 mr-2" />
                        Donor - I help fulfill wishes
                      </div>
                    </SelectItem>
                    {profile.role === 'admin' && (
                      <SelectItem value="admin">
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 mr-2" />
                          Admin - I manage the platform
                        </div>
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  You can be both, but choose your primary role. This helps us personalize your experience.
                </p>
              </div>
              
              <Button onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Role-specific Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Your Role</h3>
              <p className="text-sm text-muted-foreground">
                {profile.role === 'donor' ? (
                  <>
                    As a <strong>Donor</strong>, you help make wishes come true by contributing to causes you care about. 
                    You can browse wishes, make donations, and track your impact through karma points.
                  </>
                ) : profile.role === 'admin' ? (
                  <>
                    As an <strong>Admin</strong>, you have special privileges to manage the platform, 
                    moderate content, and help ensure a safe and positive experience for all users.
                  </>
                ) : (
                  <>
                    As a <strong>Wisher</strong>, you can create wishes for things you need help with. 
                    Share your story, set a goal amount, and let the community help make your wish come true.
                  </>
                )}
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Account Stats</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Member since:</span>
                  <br />
                  <span className="font-medium">
                    {new Date(profile.created_at || '').toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Karma points:</span>
                  <br />
                  <span className="font-medium flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    {profile.karma || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
