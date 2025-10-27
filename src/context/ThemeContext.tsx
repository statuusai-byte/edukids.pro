import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type Theme = 'nebula' | 'cosmos' | 'selva' | 'oceano';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('nebula');

  useEffect(() => {
    const storedTheme = localStorage.getItem('edukids_theme') as Theme;
    if (storedTheme) {
      setThemeState(storedTheme);
      document.documentElement.className = `theme-${storedTheme}`;
    } else {
      document.documentElement.className = 'theme-nebula';
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('edukids_theme', newTheme);
    setThemeState(newTheme);
    document.documentElement.className = `theme-${newTheme}`;
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};