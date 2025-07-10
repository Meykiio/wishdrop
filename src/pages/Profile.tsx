
import { Navigate } from 'react-router-dom';
import { UserProfile } from '@/components/UserProfile';
import { useAuth } from '@/hooks/useAuth';

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <UserProfile />
    </div>
  );
};

export default Profile;
