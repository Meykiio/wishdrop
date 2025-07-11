
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Filter, X } from 'lucide-react';

interface WishFiltersProps {
  onFiltersChange: (filters: any) => void;
  category?: string;
  urgency?: string;
  sortBy?: string;
  searchTerm?: string;
  onCategoryChange?: (value: string) => void;
  onUrgencyChange?: (value: string) => void;
  onSortByChange?: (value: string) => void;
  onSearchChange?: (value: string) => void;
  onClearFilters?: () => void;
}

export const WishFilters = ({ 
  onFiltersChange,
  category: externalCategory,
  urgency: externalUrgency,
  sortBy: externalSortBy,
  searchTerm: externalSearchTerm,
  onCategoryChange,
  onUrgencyChange,
  onSortByChange,
  onSearchChange,
  onClearFilters
}: WishFiltersProps) => {
  const [category, setCategory] = useState<string>(externalCategory || "all");
  const [urgency, setUrgency] = useState<string>(externalUrgency || "all");
  const [status, setStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState(externalSearchTerm || "");
  const [showFilters, setShowFilters] = useState(false);

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    onCategoryChange?.(value);
  };

  const handleUrgencyChange = (value: string) => {
    setUrgency(value);
    onUrgencyChange?.(value);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange?.(value);
  };

  const handleFilterChange = () => {
    const filters = {
      category: category === "all" ? null : category,
      urgency: urgency === "all" ? null : urgency,
      status: status === "all" ? null : status,
      search: searchTerm.trim() || null,
    };
    onFiltersChange(filters);
  };

  const clearFilters = () => {
    setCategory("all");
    setUrgency("all");
    setStatus("all");
    setSearchTerm("");
    onFiltersChange({
      category: null,
      urgency: null,
      status: null,
      search: null,
    });
    onClearFilters?.();
  };

  const hasActiveFilters = category !== "all" || urgency !== "all" || status !== "all" || searchTerm.trim();

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search wishes..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFilterChange()}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="pet_care">Pet Care</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency</Label>
                <Select value={urgency} onValueChange={handleUrgencyChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All urgency levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Urgency</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="funded">Funded</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-2">
            <Button onClick={handleFilterChange} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Apply Filters
            </Button>
            
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
