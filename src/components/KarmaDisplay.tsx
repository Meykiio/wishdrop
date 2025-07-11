
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Award } from 'lucide-react';

interface KarmaDisplayProps {
  karma: number;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const KarmaDisplay = ({ karma, showDetails = false, size = 'md' }: KarmaDisplayProps) => {
  const getKarmaLevel = (karmaPoints: number) => {
    if (karmaPoints >= 10000) return { level: 'Legend', color: 'text-purple-600', bg: 'bg-purple-100' };
    if (karmaPoints >= 5000) return { level: 'Master', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (karmaPoints >= 1000) return { level: 'Expert', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (karmaPoints >= 500) return { level: 'Advanced', color: 'text-green-600', bg: 'bg-green-100' };
    if (karmaPoints >= 100) return { level: 'Contributor', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { level: 'Beginner', color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  const karmaLevel = getKarmaLevel(karma);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (!showDetails) {
    return (
      <div className="flex items-center space-x-2">
        <Star className="h-4 w-4 text-yellow-500" />
        <span className={`font-medium ${sizeClasses[size]}`}>
          {karma.toLocaleString()} karma
        </span>
        <Badge variant="secondary" className={`${karmaLevel.color} ${karmaLevel.bg}`}>
          {karmaLevel.level}
        </Badge>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Star className="h-5 w-5 text-yellow-500" />
          <span>Karma Score</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              {karma.toLocaleString()}
            </div>
            <Badge variant="secondary" className={`${karmaLevel.color} ${karmaLevel.bg} mt-2`}>
              {karmaLevel.level}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Next Level</span>
              <span className="font-medium">
                {karma < 100 ? '100' : 
                 karma < 500 ? '500' : 
                 karma < 1000 ? '1,000' : 
                 karma < 5000 ? '5,000' : 
                 karma < 10000 ? '10,000' : 'Max Level'}
              </span>
            </div>
            
            {karma < 10000 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (karma / (karma < 100 ? 100 : 
                                                      karma < 500 ? 500 : 
                                                      karma < 1000 ? 1000 : 
                                                      karma < 5000 ? 5000 : 10000)) * 100)}%`
                  }}
                />
              </div>
            )}
          </div>

          <div className="text-xs text-gray-500 text-center">
            Earn karma by donating to wishes and being an active community member
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
