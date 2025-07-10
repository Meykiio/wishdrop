
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Clock, DollarSign, MapPin } from 'lucide-react';

interface Wish {
  id: string;
  title: string;
  description: string;
  amount: number;
  timeLeft: string;
  location: string;
  image: string;
  category: string;
}

const mockWishes: Wish[] = [
  {
    id: '1',
    title: 'Help me buy a laptop for coding',
    description: 'I\'m a self-taught developer who needs a laptop to continue learning and eventually find a job in tech.',
    amount: 800,
    timeLeft: '12 days',
    location: 'San Francisco, CA',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
    category: 'Education'
  },
  {
    id: '2',
    title: 'Surgery for my rescue dog',
    description: 'My beloved rescue dog needs emergency surgery. Any help would mean the world to us.',
    amount: 1200,
    timeLeft: '8 days',
    location: 'Austin, TX',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop',
    category: 'Pet Care'
  },
  {
    id: '3',
    title: 'Art supplies for community center',
    description: 'We want to start an art program for underprivileged kids in our neighborhood.',
    amount: 500,
    timeLeft: '15 days',
    location: 'Brooklyn, NY',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
    category: 'Community'
  }
];

const FeaturedWishes = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Featured Wishes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            These dreams are waiting for a hero. Could that be you?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockWishes.map((wish) => (
            <Card key={wish.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border-0 shadow-lg">
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
                <div className="absolute top-4 right-4">
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{wish.timeLeft}</span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-600 transition-colors">
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

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8 hover:bg-primary/5 hover:border-primary transition-all duration-300">
            View All Wishes
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedWishes;
