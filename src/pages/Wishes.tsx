
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Search, Filter, Clock, DollarSign, MapPin, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface Wish {
  id: string;
  title: string;
  description: string;
  amount: number;
  timeLeft: string;
  location: string;
  image: string;
  category: string;
  urgency: 'low' | 'medium' | 'high';
}

const mockWishes: Wish[] = [
  {
    id: '1',
    title: 'Help me buy a laptop for coding',
    description: 'I\'m a self-taught developer who needs a laptop to continue learning and eventually find a job in tech. This would completely change my life.',
    amount: 800,
    timeLeft: '12 days',
    location: 'San Francisco, CA',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
    category: 'Education',
    urgency: 'medium'
  },
  {
    id: '2',
    title: 'Surgery for my rescue dog',
    description: 'My beloved rescue dog needs emergency surgery. Any help would mean the world to us. She\'s been my companion for 5 years.',
    amount: 1200,
    timeLeft: '8 days',
    location: 'Austin, TX',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop',
    category: 'Pet Care',
    urgency: 'high'
  },
  {
    id: '3',
    title: 'Art supplies for community center',
    description: 'We want to start an art program for underprivileged kids in our neighborhood. These supplies would serve 50+ children.',
    amount: 500,
    timeLeft: '15 days',
    location: 'Brooklyn, NY',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
    category: 'Community',
    urgency: 'low'
  },
  {
    id: '4',
    title: 'Wheelchair for my grandmother',
    description: 'My grandmother can no longer walk long distances. A wheelchair would give her independence and dignity back.',
    amount: 600,
    timeLeft: '20 days',
    location: 'Miami, FL',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    category: 'Medical',
    urgency: 'medium'
  },
  {
    id: '5',
    title: 'Camera for documenting local history',
    description: 'I want to document the stories of elderly people in my town before their memories are lost forever.',
    amount: 400,
    timeLeft: '25 days',
    location: 'Salem, OR',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
    category: 'Community',
    urgency: 'low'
  },
  {
    id: '6',
    title: 'School supplies for my children',
    description: 'As a single mother of three, buying school supplies is a financial burden. Your help would mean everything.',
    amount: 250,
    timeLeft: '18 days',
    location: 'Phoenix, AZ',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    category: 'Education',
    urgency: 'medium'
  }
];

const categories = ['All', 'Education', 'Medical', 'Pet Care', 'Community', 'Technology', 'Family', 'Emergency'];
const sortOptions = ['Most Recent', 'Urgent', 'Amount: Low to High', 'Amount: High to Low', 'Ending Soon'];

const Wishes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Most Recent');
  const [showFilters, setShowFilters] = useState(false);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'Urgent';
      case 'medium': return 'Moderate';
      case 'low': return 'Low Priority';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navbar />
      
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-32 left-10 text-purple-300 float-animation">
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="absolute bottom-20 right-10 text-pink-300 float-animation" style={{ animationDelay: '1s' }}>
          <Heart className="h-8 w-8" />
        </div>
      </div>

      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Dreams Waiting for Heroes
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse wishes from dreamers around the world. Find one that speaks to your heart and make magic happen.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search wishes by title, story, or location..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full lg:w-auto"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Amount Range
                  </label>
                  <div className="flex space-x-2">
                    <Input placeholder="Min" />
                    <Input placeholder="Max" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Location
                  </label>
                  <Input placeholder="City, State" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Urgency
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any urgency</SelectItem>
                      <SelectItem value="high">Urgent</SelectItem>
                      <SelectItem value="medium">Moderate</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{mockWishes.length}</span> wishes
          </p>
        </div>

        {/* Wishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockWishes.map((wish) => (
            <Card key={wish.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <div className="relative">
                <img 
                  src={wish.image} 
                  alt={wish.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-purple-600">
                    {wish.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <div className={`${getUrgencyColor(wish.urgency)} text-white px-2 py-1 rounded-full text-xs font-medium`}>
                    {getUrgencyText(wish.urgency)}
                  </div>
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{wish.timeLeft}</span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                  {wish.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {wish.description}
                </p>
                
                <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{wish.location}</span>
                  </div>
                  <div className="flex items-center space-x-1 font-semibold text-green-600">
                    <DollarSign className="h-4 w-4" />
                    <span>${wish.amount}</span>
                  </div>
                </div>

                <Button className="w-full wish-gradient text-white hover:shadow-lg hover:shadow-primary/25 transition-all duration-300">
                  <Heart className="mr-2 h-4 w-4" />
                  Fulfill This Wish
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8 hover:bg-primary/5 hover:border-primary transition-all duration-300">
            Load More Wishes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Wishes;
