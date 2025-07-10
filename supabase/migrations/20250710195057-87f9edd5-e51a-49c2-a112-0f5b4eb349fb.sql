
-- Create enum types
CREATE TYPE user_role AS ENUM ('wisher', 'donor', 'admin');
CREATE TYPE wish_status AS ENUM ('pending', 'funded', 'expired', 'rejected');
CREATE TYPE wish_category AS ENUM ('education', 'medical', 'pet_care', 'community', 'technology', 'family', 'emergency', 'other');
CREATE TYPE wish_urgency AS ENUM ('low', 'medium', 'high');

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  role user_role DEFAULT 'wisher',
  profile_pic TEXT,
  bio TEXT,
  karma INTEGER DEFAULT 0,
  location TEXT,
  phone TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create wishes table
CREATE TABLE public.wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category wish_category NOT NULL,
  amount INTEGER NOT NULL, -- amount in cents
  currency TEXT DEFAULT 'USD',
  urgency wish_urgency DEFAULT 'medium',
  media_url TEXT,
  location TEXT,
  status wish_status DEFAULT 'pending',
  is_private BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create donations table
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wish_id UUID REFERENCES public.wishes(id) ON DELETE CASCADE NOT NULL,
  donor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL, -- amount in cents
  currency TEXT DEFAULT 'USD',
  is_anonymous BOOLEAN DEFAULT true,
  message TEXT,
  stripe_session_id TEXT,
  status TEXT DEFAULT 'pending', -- pending, completed, failed
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create badges table
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  criteria_amount INTEGER, -- for amount-based badges
  criteria_count INTEGER, -- for count-based badges
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_badges table (many-to-many)
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT now(),
  reason TEXT,
  UNIQUE(user_id, badge_id)
);

-- Create reports table
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wish_id UUID REFERENCES public.wishes(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  is_reviewed BOOLEAN DEFAULT false,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create thank_you_messages table
CREATE TABLE public.thank_you_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id UUID REFERENCES public.donations(id) ON DELETE CASCADE NOT NULL,
  message TEXT,
  media_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thank_you_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for wishes
CREATE POLICY "Public wishes are viewable by everyone" ON public.wishes
  FOR SELECT USING (NOT is_private OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own wishes" ON public.wishes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wishes" ON public.wishes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wishes" ON public.wishes
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for donations
CREATE POLICY "Donations are viewable by wish owner and donor" ON public.donations
  FOR SELECT USING (
    auth.uid() = donor_id OR 
    auth.uid() = (SELECT user_id FROM public.wishes WHERE id = wish_id)
  );

CREATE POLICY "Authenticated users can insert donations" ON public.donations
  FOR INSERT WITH CHECK (auth.uid() = donor_id);

-- RLS Policies for badges
CREATE POLICY "Badges are viewable by everyone" ON public.badges
  FOR SELECT USING (true);

-- RLS Policies for user_badges
CREATE POLICY "User badges are viewable by everyone" ON public.user_badges
  FOR SELECT USING (true);

-- RLS Policies for reports
CREATE POLICY "Users can insert reports" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their own reports" ON public.reports
  FOR SELECT USING (auth.uid() = reporter_id);

-- RLS Policies for thank_you_messages
CREATE POLICY "Thank you messages viewable by involved parties" ON public.thank_you_messages
  FOR SELECT USING (
    auth.uid() = (SELECT donor_id FROM public.donations WHERE id = donation_id) OR
    auth.uid() = (SELECT w.user_id FROM public.wishes w JOIN public.donations d ON w.id = d.wish_id WHERE d.id = donation_id)
  );

CREATE POLICY "Wish owners can insert thank you messages" ON public.thank_you_messages
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT w.user_id FROM public.wishes w JOIN public.donations d ON w.id = d.wish_id WHERE d.id = donation_id)
  );

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default badges
INSERT INTO public.badges (name, description, icon, criteria_amount, criteria_count) VALUES
('First Wish', 'Posted your first wish', '🌟', NULL, 1),
('Generous Heart', 'Donated over $100', '💝', 10000, NULL),
('Flex King', 'Donated over $25,000', '👑', 2500000, NULL),
('Early Angel', 'One of the first 100 donors', '😇', NULL, 100),
('Heartwarmer', 'Received 50+ thank you messages', '💖', NULL, 50),
('Silent Hero', 'Always donates anonymously', '🤫', NULL, 10),
('Dream Maker', 'Granted 30+ wishes', '✨', NULL, 30),
('Golden Heart', 'Highest rated donor', '💛', NULL, NULL),
('Wish Granter', 'Fulfilled 10+ wishes', '🧞‍♂️', NULL, 10),
('Magic Maker', 'Helped make dreams come true', '🪄', NULL, 5);

-- Create function to update karma and check badges
CREATE OR REPLACE FUNCTION public.update_user_karma()
RETURNS TRIGGER AS $$
BEGIN
  -- Update donor karma
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE public.profiles 
    SET karma = karma + (NEW.amount / 100) -- 1 karma per dollar
    WHERE id = NEW.donor_id;
    
    -- Check for badges
    -- Generous Heart badge
    IF (SELECT SUM(amount) FROM public.donations WHERE donor_id = NEW.donor_id AND status = 'completed') >= 10000 THEN
      INSERT INTO public.user_badges (user_id, badge_id, reason)
      SELECT NEW.donor_id, id, 'Donated over $100'
      FROM public.badges 
      WHERE name = 'Generous Heart'
      AND NOT EXISTS (
        SELECT 1 FROM public.user_badges 
        WHERE user_id = NEW.donor_id AND badge_id = badges.id
      );
    END IF;
    
    -- Flex King badge
    IF (SELECT SUM(amount) FROM public.donations WHERE donor_id = NEW.donor_id AND status = 'completed') >= 2500000 THEN
      INSERT INTO public.user_badges (user_id, badge_id, reason)
      SELECT NEW.donor_id, id, 'Donated over $25,000'
      FROM public.badges 
      WHERE name = 'Flex King'
      AND NOT EXISTS (
        SELECT 1 FROM public.user_badges 
        WHERE user_id = NEW.donor_id AND badge_id = badges.id
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for karma updates
CREATE TRIGGER update_karma_on_donation
  AFTER UPDATE ON public.donations
  FOR EACH ROW EXECUTE FUNCTION public.update_user_karma();

-- Create indexes for performance
CREATE INDEX idx_wishes_status ON public.wishes(status);
CREATE INDEX idx_wishes_category ON public.wishes(category);
CREATE INDEX idx_wishes_created_at ON public.wishes(created_at);
CREATE INDEX idx_donations_donor_id ON public.donations(donor_id);
CREATE INDEX idx_donations_wish_id ON public.donations(wish_id);
CREATE INDEX idx_profiles_karma ON public.profiles(karma DESC);
