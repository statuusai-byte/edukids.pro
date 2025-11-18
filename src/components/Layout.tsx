import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import MobileTabBar from '@/components/MobileTabBar';
import AmbientBackground from '@/components/AmbientBackground';
import StudyAssistant from '@/components/StudyAssistant';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet } from '@/components/ui/sheet';
import MobileSidebar from '@/components/MobileSidebar';
import { cn } from '@/lib/utils';
import { useInterstitialAdManager } from '@/hooks/useInterstitialAdManager';

const Layout = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  useInterstitialAdManager();

  const fullWidthRoutes = ['/', '/login', '/register', '/privacy-policy'];
  const isFullWidth = fullWidthRoutes.includes(location.pathname) || location.pathname.startsWith('/success-payment');

  return (
    <AmbientBackground>
      <Sheet>
        <MobileSidebar />
        <Header />
        <main
          className={cn(
            'flex-grow',
            isFullWidth ? 'pt-20' : 'container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 md:pb-8'
          )}
        >
          <Outlet />
        </main>
        {isMobile && <MobileTabBar />}
        <StudyAssistant />
      </Sheet>
    </AmbientBackground>
  );
};

export default Layout;