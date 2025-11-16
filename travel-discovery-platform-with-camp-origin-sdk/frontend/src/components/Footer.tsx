import { Heart } from 'lucide-react';
import { SiFacebook, SiX, SiInstagram } from 'react-icons/si';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <div className="flex gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Facebook"
            >
              <SiFacebook className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <SiX className="h-5 w-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <SiInstagram className="h-5 w-5" />
            </a>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            © 2025. Built with <Heart className="h-4 w-4 text-destructive fill-destructive" /> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-xs text-muted-foreground max-w-2xl">
            Discover your next adventure with personalized travel recommendations powered by Camp Network
          </p>
        </div>
      </div>
    </footer>
  );
}
