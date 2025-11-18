import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { showError } from '@/utils/toast';

interface Profile {
  name: string;
  avatarUrl: string | null;
}

interface ProfileContextType extends Profile {
  setName: (name: string) => Promise<void>;
  setAvatarFile: (file: File) => Promise<void>;
  isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const DEFAULT_PROFILE: Profile = {
  name: 'Explorador',
  avatarUrl: null,
};

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  // Ignoramos o user do Supabase
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Em modo liberado, o perfil é sempre o padrão.
    setIsLoading(false);
  }, []);

  const setName = async (newName: string) => {
    // Apenas atualiza localmente
    setProfile(prev => ({ ...prev, name: newName }));
    showError("Nome atualizado localmente. (Não persistirá no servidor)");
  };

  const setAvatarFile = async (_file: File) => {
    // Apenas simula o upload
    showError("Upload de avatar desativado em modo liberado.");
  };

  return (
    <ProfileContext.Provider value={{ ...profile, setName, setAvatarFile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};