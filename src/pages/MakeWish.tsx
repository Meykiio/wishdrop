
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Upload, MapPin, DollarSign, Calendar, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';

const categories = [
  'Education',
  'Medical',
  'Pet Care',
  'Community',
  'Technology',
  'Family',
  'Emergency',
  'Other'
];

const MakeWish = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    amount: '',
    location: '',
    deadline: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Wish submitted:', formData);
    // TODO: Implement wish submission logic
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Make Your Wish
            </h1>
            <p className="text-xl text-gray-600">
              Share your dream with the world. Be authentic, be hopeful, be you.
            </p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-primary" />
                <span>Tell Us About Your Wish</span>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Wish Title *
                  </label>
                  <Input
                    placeholder="e.g., Help me buy a laptop for coding"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Your Story *
                  </label>
                  <Textarea
                    placeholder="Share your story... Why is this wish important to you? How will it change your life?"
                    className="min-h-32"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Be authentic and heartfelt. Great stories get more support!
                  </p>
                </div>

                {/* Category and Amount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Category *
                    </label>
                    <Select onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Amount Needed *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="number"
                        placeholder="0"
                        className="pl-10"
                        value={formData.amount}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="City, State/Country"
                      className="pl-10"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />
                  </div>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Add Photos/Videos
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Drag and drop your files here, or click to browse
                    </p>
                    <p className="text-xs text-gray-500">
                      Images and videos make your wish more compelling
                    </p>
                    <Button type="button" variant="outline" className="mt-4">
                      Choose Files
                    </Button>
                  </div>
                </div>

                {/* Terms */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-2">Before you submit:</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Be honest and authentic in your story</li>
                    <li>• One active wish per account (until you're donor-verified)</li>
                    <li>• Wishes expire after 30 days if not funded</li>
                    <li>• Follow our community guidelines</li>
                  </ul>
                </div>

                {/* Submit */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    size="lg"
                    className="w-full wish-gradient text-white hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    Submit My Wish
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MakeWish;
