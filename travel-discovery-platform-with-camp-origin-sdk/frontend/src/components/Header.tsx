import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Menu, Moon, Sun, Plane, Wallet, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useOrigin } from '../hooks/useOrigin';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { user, isConnected, isConnecting, connectWallet, disconnectWallet } = useOrigin();
  const { data: userProfile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();

  const navItems = [
    { label: 'Discover', path: '/' },
    { label: 'Coming Soon', path: '/coming-soon' },
  ];

  const handleAuth = async () => {
    if (isConnected) {
      await disconnectWallet();
      queryClient.clear();
      toast.success('Wallet disconnected');
    } else {
      try {
        await connectWallet();
        toast.success('Wallet connected successfully');
      } catch (error: any) {
        console.error('Connection error:', error);
        toast.error('Failed to connect wallet');
      }
    }
  };

  const displayName = userProfile?.name || user?.handle || (user?.address ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}` : '');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Plane className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            TravelDiscover
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-sm font-medium transition-colors hover:text-primary"
              activeProps={{ className: 'text-primary' }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isConnected && displayName && (
            <div className="hidden md:flex items-center gap-2 mr-2">
              <span className="text-sm text-muted-foreground">Connected:</span>
              <span className="text-sm font-medium">{displayName}</span>
            </div>
          )}

          <Button
            variant={isConnected ? 'outline' : 'default'}
            size="sm"
            onClick={handleAuth}
            disabled={isConnecting}
            className="hidden md:inline-flex"
          >
            {isConnecting ? (
              <>
                <Wallet className="mr-2 h-4 w-4 animate-pulse" />
                Connecting...
              </>
            ) : isConnected ? (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Disconnect
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="hidden md:inline-flex"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {isConnected && displayName && (
                  <div className="pb-4 border-b border-border">
                    <p className="text-sm text-muted-foreground">Connected as</p>
                    <p className="text-sm font-medium">{displayName}</p>
                  </div>
                )}

                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="text-lg font-medium transition-colors hover:text-primary"
                    activeProps={{ className: 'text-primary' }}
                  >
                    {item.label}
                  </Link>
                ))}

                <Button variant="ghost" onClick={handleAuth} disabled={isConnecting} className="justify-start">
                  {isConnecting ? (
                    <>
                      <Wallet className="mr-2 h-5 w-5 animate-pulse" />
                      Connecting...
                    </>
                  ) : isConnected ? (
                    <>
                      <LogOut className="mr-2 h-5 w-5" />
                      Disconnect Wallet
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-2 h-5 w-5" />
                      Connect Wallet
                    </>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="justify-start"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="mr-2 h-5 w-5" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="mr-2 h-5 w-5" />
                      Dark Mode
                    </>
                  )}
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
