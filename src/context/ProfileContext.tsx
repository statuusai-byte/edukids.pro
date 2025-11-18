import { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useSupabase } from './SupabaseContext';
import { supabase } from '@/integrations/supabase/client';
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
  const { user, isLoading: isAuthLoading } = useSupabase();
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(DEFAULT_PROFILE);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        const fullName = `${data.first_name || ''} ${data.last_name || ''}`.trim();
        setProfile({
          name: fullName || 'Explorador',
          avatarUrl: data.avatar_url,
        });
      } else {
        setProfile(DEFAULT_PROFILE);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile(DEFAULT_PROFILE);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthLoading) {
      fetchProfile();
    }
  }, [user, isAuthLoading, fetchProfile]);

  const setName = async (newName: string) => {
    if (!user) {
      showError("Você precisa estar logado para alterar seu nome.");
      return;
    }
    const [firstName, ...lastNameParts] = newName.split(' ');
    const lastName = lastNameParts.join(' ');

    const { error } = await supabase
      .from('profiles')
      .update({ first_name: firstName, last_name: lastName })
      .eq('id', user.id);

    if (error) {
      showError("Falha ao atualizar o nome.");
      throw error;
    }
    setProfile(prev => ({ ...prev, name: newName }));
  };

  const setAvatarFile = async (file: File) => {
    if (!user) {
      showError("Você precisa estar logado para alterar seu avatar.");
      return;
    }
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      showError("Falha no upload do avatar.");
      throw uploadError;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: filePath })
      .eq('id', user.id);

    if (updateError) {
      showError("Falha ao salvar o novo avatar.");
      throw updateError;
    }
    
    // Fetch the new public URL to update the UI
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    setProfile(prev => ({ ...prev, avatarUrl: data.publicUrl }));
  };

  return (
    <ProfileContext.Provider value={{ ...profile, setName, setAvatarFile, isLoading: isLoading || isAuthLoading }}>
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