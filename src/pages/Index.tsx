
import Hero from '@/components/Hero';
import FeaturedWishes from '@/components/FeaturedWishes';
import HowItWorks from '@/components/HowItWorks';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedWishes />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;
