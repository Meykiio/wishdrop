
import { useState, useEffect } from 'react';
import { WishCard } from '@/components/WishCard';
import { WishFilters } from '@/components/WishFilters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { Link } from 'react-router-dom';

type Wish = Tables<'wishes'> & {
  profiles: Tables<'profiles'>;
  donations: { amount: number }[];
};

const Wishes = () => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [urgency, setUrgency] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWishes();
  }, [category, urgency, sortBy, searchTerm]);

  const fetchWishes = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('wishes')
        .select(`
          *,
          profiles (*),
          donations (amount)
        `)
        .eq('status', 'pending')
        .eq('is_private', false);

      if (category) {
        query = query.eq('category', category as Tables<'wishes'>['category']);
      }

      if (urgency) {
        query = query.eq('urgency', urgency as Tables<'wishes'>['urgency']);
      }

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      // Apply sorting
      if (sortBy === 'created_at') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'expires_at') {
        query = query.order('expires_at', { ascending: true });
      } else if (sortBy === 'amount') {
        query = query.order('amount', { ascending: true });
      } else if (sortBy === 'amount_desc') {
        query = query.order('amount', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      setWishes(data || []);
    } catch (error) {
      console.error('Error fetching wishes:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setCategory('');
    setUrgency('');
    setSortBy('created_at');
    setSearchTerm('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Wishes</h1>
          <p className="text-gray-600">Help make someone's dream come true</p>
        </div>
        <Button asChild>
          <Link to="/make-wish">
            <Plus className="h-4 w-4 mr-2" />
            Make a Wish
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <WishFilters
          category={category}
          urgency={urgency}
          sortBy={sortBy}
          searchTerm={searchTerm}
          onCategoryChange={setCategory}
          onUrgencyChange={setUrgency}
          onSortByChange={setSortBy}
          onSearchChange={setSearchTerm}
          onClearFilters={clearFilters}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : wishes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No wishes found matching your criteria.</p>
          <Button variant="outline" onClick={clearFilters} className="mt-4">
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishes.map((wish) => (
            <WishCard key={wish.id} wish={wish} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishes;
