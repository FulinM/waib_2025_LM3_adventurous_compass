import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, Map, Calendar, MessageCircle, Camera, Award } from 'lucide-react';

export default function ComingSoonPage() {
  const upcomingFeatures = [
    {
      icon: Map,
      title: 'Interactive Travel Maps',
      description: 'Explore destinations with interactive maps, save your favorite spots, and plan your route.',
      status: 'In Development',
    },
    {
      icon: Calendar,
      title: 'Trip Planning Tools',
      description: 'Create detailed itineraries, book accommodations, and manage your travel schedule in one place.',
      status: 'Planned',
    },
    {
      icon: MessageCircle,
      title: 'Traveler Chat',
      description: 'Connect with other travelers, ask questions, and share tips in real-time.',
      status: 'Planned',
    },
    {
      icon: Camera,
      title: 'Photo Sharing',
      description: 'Share your travel photos, create albums, and inspire others with your adventures.',
      status: 'Planned',
    },
    {
      icon: Award,
      title: 'Rewards Program',
      description: 'Earn points for reviews, recommendations, and community engagement.',
      status: 'Planned',
    },
    {
      icon: Plane,
      title: 'Flight & Hotel Booking',
      description: 'Book flights and accommodations directly through the platform with exclusive deals.',
      status: 'Planned',
    },
  ];

  return (
    <div className="container py-8 space-y-8">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="flex justify-center">
          <img
            src="/assets/generated/travel-coming-soon.dim_400x250.png"
            alt="Coming Soon"
            className="rounded-lg border border-border/40 shadow-lg"
          />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Exciting Features Coming Soon</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're building powerful new features to make your travel planning and discovery experience even better.
            Stay tuned for updates!
          </p>
        </div>
      </section>

      {/* Upcoming Features */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">What's Next</h2>
          <p className="text-muted-foreground">Features and enhancements currently in development</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcomingFeatures.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge variant={feature.status === 'In Development' ? 'default' : 'secondary'}>
                  {feature.status}
                </Badge>
              </div>
              <CardHeader>
                <feature.icon className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Roadmap Timeline */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Development Roadmap</h2>
          <p className="text-muted-foreground">Our planned timeline for feature releases</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    1
                  </div>
                  <div className="w-0.5 h-full bg-border mt-2" />
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="font-semibold mb-1">Phase 1: Foundation (Current)</h3>
                  <p className="text-sm text-muted-foreground">
                    Camp SDK integration, user authentication, destination discovery, and community features
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold">2</div>
                  <div className="w-0.5 h-full bg-border mt-2" />
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="font-semibold mb-1">Phase 2: Planning Tools</h3>
                  <p className="text-sm text-muted-foreground">
                    Interactive maps, trip planning, itinerary management, and booking integration
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold">3</div>
                  <div className="w-0.5 h-full bg-border mt-2" />
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="font-semibold mb-1">Phase 3: Social Features</h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time chat, photo sharing, travel groups, and enhanced community engagement
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold">4</div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Phase 4: Advanced Features</h3>
                  <p className="text-sm text-muted-foreground">
                    AI-powered recommendations, rewards program, exclusive deals, and partner integrations
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Extension Points */}
      <section className="space-y-6">
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle>Built for Growth</CardTitle>
            <CardDescription>Modular architecture designed for continuous expansion</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              TravelDiscover is built with a clean, modular architecture powered by Camp Network's Origin SDK, making
              it easy to add new features and scale:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  <strong>Camp SDK Integration:</strong> Seamless authentication and user management
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  <strong>Component-based UI:</strong> Reusable travel components for consistent design
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  <strong>React Query integration:</strong> Efficient data fetching and caching
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  <strong>Type-safe backend:</strong> TypeScript definitions for all API interactions
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  <strong>Extensible routing:</strong> Easy addition of new pages and features
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
