import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Users, Compass, TrendingUp, Heart, Wallet } from 'lucide-react';
import { useOrigin } from '../hooks/useOrigin';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';

export default function HomePage() {
  const { isConnected, user, isConnecting, connectWallet } = useOrigin();
  const { data: userProfile } = useGetCallerUserProfile();

  const featuredDestinations = [
    {
      name: 'Tropical Paradise',
      location: 'Maldives',
      image: '/assets/generated/tropical-destination.dim_400x300.png',
      rating: 4.9,
      reviews: 1234,
      description: 'Crystal clear waters and pristine beaches await you in this island paradise.',
      tags: ['Beach', 'Luxury', 'Relaxation'],
    },
    {
      name: 'Mountain Adventure',
      location: 'Swiss Alps',
      image: '/assets/generated/mountain-destination.dim_400x300.png',
      rating: 4.8,
      reviews: 987,
      description: 'Experience breathtaking alpine views and world-class skiing in the heart of Europe.',
      tags: ['Adventure', 'Nature', 'Winter'],
    },
    {
      name: 'Urban Explorer',
      location: 'Tokyo, Japan',
      image: '/assets/generated/city-destination.dim_400x300.png',
      rating: 4.9,
      reviews: 2156,
      description: 'Immerse yourself in the perfect blend of ancient tradition and cutting-edge modernity.',
      tags: ['Cultural', 'City', 'Food'],
    },
  ];

  const displayName = userProfile?.name || user?.handle;

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      toast.success('Wallet connected successfully');
    } catch (error: any) {
      console.error('Connection error:', error);
      toast.error('Failed to connect wallet');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-accent/20">
        <div className="container py-16 md:py-24">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="w-fit">
                <Compass className="mr-1 h-3 w-3" />
                Powered by Camp Network
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Discover Your Next
                <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Adventure
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl">
                Explore personalized travel recommendations, connect with fellow travelers, and create unforgettable
                memories around the world.
              </p>
              {!isConnected ? (
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="text-lg" onClick={handleConnectWallet} disabled={isConnecting}>
                    {isConnecting ? (
                      <>
                        <Wallet className="mr-2 h-5 w-5 animate-pulse" />
                        Connecting...
                      </>
                    ) : (
                      'Get Started'
                    )}
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg" asChild>
                    <Link to="/coming-soon">Learn More</Link>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-muted-foreground">
                      Welcome back, <span className="font-medium text-foreground">{displayName}</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <img
                src="/assets/generated/network-hero.dim_800x400.png"
                alt="Travel Discovery"
                className="rounded-lg shadow-2xl border border-border/40"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border/40 bg-muted/30">
        <div className="container py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <p className="text-3xl font-bold">500+</p>
              <p className="text-sm text-muted-foreground">Destinations</p>
            </div>
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <p className="text-3xl font-bold">10K+</p>
              <p className="text-sm text-muted-foreground">Travelers</p>
            </div>
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <p className="text-3xl font-bold">50K+</p>
              <p className="text-sm text-muted-foreground">Reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="container py-16 space-y-8">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="mb-2">
            <TrendingUp className="mr-1 h-3 w-3" />
            Trending Now
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">Featured Destinations</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our handpicked selection of amazing destinations that travelers love
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredDestinations.map((destination, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-3 right-3 rounded-full"
                  aria-label="Add to favorites"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{destination.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {destination.location}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{destination.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{destination.description}</p>
                <div className="flex flex-wrap gap-2">
                  {destination.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground">{destination.reviews} reviews</span>
                  <Button size="sm" variant="outline">
                    Explore
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 border-y border-border/40">
        <div className="container py-16">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="w-fit">
                <Users className="mr-1 h-3 w-3" />
                Community
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">Join Our Travel Community</h2>
              <p className="text-lg text-muted-foreground">
                Connect with fellow travelers, share your experiences, and discover hidden gems recommended by people
                who've been there.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Star className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Authentic Reviews</p>
                    <p className="text-sm text-muted-foreground">Real experiences from real travelers</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Personalized Recommendations</p>
                    <p className="text-sm text-muted-foreground">Tailored to your travel style and preferences</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Users className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Travel Groups</p>
                    <p className="text-sm text-muted-foreground">Find travel companions for your next adventure</p>
                  </div>
                </li>
              </ul>
              {!isConnected && (
                <Button size="lg" className="mt-4" onClick={handleConnectWallet} disabled={isConnecting}>
                  {isConnecting ? (
                    <>
                      <Wallet className="mr-2 h-5 w-5 animate-pulse" />
                      Connecting...
                    </>
                  ) : (
                    'Join the Community'
                  )}
                </Button>
              )}
            </div>
            <div className="relative">
              <img
                src="/assets/generated/travel-group.dim_300x200.png"
                alt="Travel Community"
                className="rounded-lg shadow-xl border border-border/40 w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isConnected && (
        <section className="container py-16">
          <Card className="bg-gradient-to-br from-primary to-accent text-primary-foreground border-0">
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Your Journey?</h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                Connect your wallet to unlock personalized travel recommendations, connect with travelers worldwide, and plan
                your dream vacation.
              </p>
              <Button size="lg" variant="secondary" className="text-lg" onClick={handleConnectWallet} disabled={isConnecting}>
                {isConnecting ? (
                  <>
                    <Wallet className="mr-2 h-5 w-5 animate-pulse" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-5 w-5" />
                    Connect Wallet
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
