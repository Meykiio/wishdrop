
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

interface WishFiltersProps {
  category: string;
  urgency: string;
  sortBy: string;
  searchTerm: string;
  onCategoryChange: (value: string) => void;
  onUrgencyChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onClearFilters: () => void;
}

export const WishFilters = ({
  category,
  urgency,
  sortBy,
  searchTerm,
  onCategoryChange,
  onUrgencyChange,
  onSortByChange,
  onSearchChange,
  onClearFilters,
}: WishFiltersProps) => {
  const categories = [
    { value: 'all_categories', label: 'All Categories' },
    { value: 'education', label: 'Education' },
    { value: 'medical', label: 'Medical' },
    { value: 'family', label: 'Family' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'technology', label: 'Technology' },
    { value: 'community', label: 'Community' },
    { value: 'pet_care', label: 'Pet Care' },
    { value: 'other', label: 'Other' },
  ];

  const handleCategoryChange = (value: string) => {
    onCategoryChange(value === 'all_categories' ? '' : value);
  };

  const handleUrgencyChange = (value: string) => {
    onUrgencyChange(value === 'all_urgency' ? '' : value);
  };

  return (
    <div className="bg-card p-4 rounded-lg border space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Filter className="h-4 w-4" />
        Filters
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search wishes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={category || 'all_categories'} onValueChange={handleCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={urgency || 'all_urgency'} onValueChange={handleUrgencyChange}>
          <SelectTrigger>
            <SelectValue placeholder="Urgency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_urgency">All Urgency</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Newest</SelectItem>
            <SelectItem value="expires_at">Expiring Soon</SelectItem>
            <SelectItem value="amount">Amount (Low to High)</SelectItem>
            <SelectItem value="amount_desc">Amount (High to Low)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" size="sm" onClick={onClearFilters}>
        Clear Filters
      </Button>
    </div>
  );
};
