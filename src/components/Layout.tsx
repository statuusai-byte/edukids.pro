import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import { cn } from '@/lib/utils';

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header />
      <main className={cn(
        "container mx-auto px-4 py-8",
        !isHomePage && "mt-20" // Adiciona margem superior em todas as páginas, exceto na home
      )}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;