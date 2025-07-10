
import { Navigate } from 'react-router-dom';
import { WishForm } from '@/components/WishForm';
import { useAuth } from '@/hooks/useAuth';

const MakeWish = () => {
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
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Make a Wish</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Share your dream and let our community of generous donors help make it come true.
          Be specific about your needs and tell your story authentically.
        </p>
      </div>
      <WishForm />
    </div>
  );
};

export default MakeWish;
