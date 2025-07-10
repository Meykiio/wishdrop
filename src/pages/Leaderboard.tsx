
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Crown, Medal, Star, Heart, Gift, Sparkles, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface LeaderboardEntry {
  id: string;
  name: string;
  karma: number;
  wishesGranted: number;
  totalDonated: number;
  badges: string[];
  avatar: string;
  isAnonymous?: boolean;
}

const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: '1',
    name: 'Anonymous Hero #1',
    karma: 15420,
    wishesGranted: 47,
    totalDonated: 28500,
    badges: ['Flex King', 'Early Angel', 'Heartwarmer'],
    avatar: '👑',
    isAnonymous: true
  },
  {
    id: '2',
    name: 'Sarah M.',
    karma: 12890,
    wishesGranted: 38,
    totalDonated: 22100,
    badges: ['Silent Hero', 'Dream Maker', 'Golden Heart'],
    avatar: '⭐'
  },
  {
    id: '3',
    name: 'Anonymous Genie',
    karma: 11250,
    wishesGranted: 32,
    totalDonated: 19800,
    badges: ['Wish Granter', 'Magic Maker', 'Kindness Legend'],
    avatar: '🧞‍♂️',
    isAnonymous: true
  },
  {
    id: '4',
    name: 'Alex K.',
    karma: 9680,
    wishesGranted: 29,
    totalDonated: 16700,
    badges: ['Community Champion', 'Hope Bringer'],
    avatar: '💎'
  },
  {
    id: '5',
    name: 'Anonymous Fairy',
    karma: 8540,
    wishesGranted: 25,
    totalDonated: 14200,
    badges: ['Fairy Godparent', 'Miracle Worker'],
    avatar: '🧚‍♀️',
    isAnonymous: true
  }
];

const badges = [
  { name: 'Flex King', icon: '👑', description: 'Donated over $25,000' },
  { name: 'Early Angel', icon: '😇', description: 'One of the first 100 donors' },
  { name: 'Heartwarmer', icon: '💖', description: 'Received 50+ thank you messages' },
  { name: 'Silent Hero', icon: '🤫', description: 'Always donates anonymously' },
  { name: 'Dream Maker', icon: '✨', description: 'Granted 30+ wishes' },
  { name: 'Golden Heart', icon: '💛', description: 'Highest rated donor' },
];

const Leaderboard = () => {
  const [timeframe, setTimeframe] = useState<'monthly' | 'all-time'>('all-time');

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Medal className="h-6 w-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-gray-600">#{position}</span>;
    }
  };

  const getRankStyle = (position: number) => {
    switch (position) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white karma-glow';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3: return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
      default: return 'bg-white hover:bg-gray-50';
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
            Hall of Heroes
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Celebrating the generous souls who make dreams come true. Climb the ranks and earn eternal glory!
          </p>
        </div>

        {/* Timeframe Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-1 shadow-lg">
            <Button
              variant={timeframe === 'monthly' ? 'default' : 'ghost'}
              onClick={() => setTimeframe('monthly')}
              className={timeframe === 'monthly' ? 'wish-gradient text-white' : ''}
            >
              This Month
            </Button>
            <Button
              variant={timeframe === 'all-time' ? 'default' : 'ghost'}
              onClick={() => setTimeframe('all-time')}
              className={timeframe === 'all-time' ? 'wish-gradient text-white' : ''}
            >
              All Time
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Leaderboard */}
          <div className="lg:col-span-2">
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  <span>Top Heroes</span>
                  <span className="text-sm font-normal text-gray-500">
                    ({timeframe === 'monthly' ? 'This Month' : 'All Time'})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockLeaderboard.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`p-4 rounded-lg transition-all duration-300 hover:scale-[1.02] ${getRankStyle(index + 1)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12">
                          {getRankIcon(index + 1)}
                        </div>
                        
                        <div className="text-4xl">{entry.avatar}</div>
                        
                        <div>
                          <h3 className="font-semibold text-lg flex items-center space-x-2">
                            <span>{entry.name}</span>
                            {entry.isAnonymous && <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">Anonymous</span>}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm opacity-90">
                            <span className="flex items-center space-x-1">
                              <Zap className="h-4 w-4" />
                              <span>{entry.karma.toLocaleString()} karma</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Heart className="h-4 w-4" />
                              <span>{entry.wishesGranted} wishes</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Gift className="h-4 w-4" />
                              <span>${entry.totalDonated.toLocaleString()}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {entry.badges.slice(0, 3).map((badge) => (
                          <span
                            key={badge}
                            className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Badge Showcase */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-6 w-6 text-purple-500" />
                  <span>Achievement Badges</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {badges.map((badge) => (
                  <div key={badge.name} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <h4 className="font-medium">{badge.name}</h4>
                      <p className="text-xs text-gray-600">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Community Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">1,234</div>
                  <div className="text-sm text-gray-600">Total Wishes Granted</div>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">$156,789</div>
                  <div className="text-sm text-gray-600">Total Donated</div>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600">456</div>
                  <div className="text-sm text-gray-600">Active Heroes</div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2">Join the Heroes!</h3>
                <p className="text-sm opacity-90 mb-4">
                  Start fulfilling wishes and climb the leaderboard
                </p>
                <Button className="bg-white text-purple-600 hover:bg-gray-100 w-full">
                  <Heart className="mr-2 h-4 w-4" />
                  Start Giving
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
