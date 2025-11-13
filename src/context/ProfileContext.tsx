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
  name: 'Alex',
  avatarUrl: null, // Default avatar is handled by UI fallback
};

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useSupabase();
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

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
      }

      if (data) {
        const fullName = [data.first_name, data.last_name].filter(Boolean).join(' ');
        let signedAvatarUrl: string | null = null;

        if (data.avatar_url) {
          const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from('avatars')
            .createSignedUrl(data.avatar_url, 3600); // 1 hour expiry

          if (signedUrlError) {
            console.error("Failed to create signed URL for avatar", signedUrlError);
          } else {
            signedAvatarUrl = signedUrlData.signedUrl;
          }
        }
        
        setProfile({
          name: fullName || 'Explorador',
          avatarUrl: signedAvatarUrl,
        });
      } else {
        setProfile({ name: 'Explorador', avatarUrl: null });
      }
    } catch (error) {
      console.error("Failed to load profile from Supabase", error);
      setProfile(DEFAULT_PROFILE);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const setName = async (newName: string) => {
    if (!user) {
      showError("Você precisa estar logado para alterar seu nome.");
      return;
    }
    const [firstName, ...lastNameParts] = newName.trim().split(' ');
    const lastName = lastNameParts.join(' ');

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, first_name: firstName, last_name: lastName, updated_at: new Date().toISOString() });

    if (error) {
      showError("Falha ao salvar o nome.");
      console.error(error);
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
    const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      showError("Falha ao enviar o avatar.");
      console.error(uploadError);
      throw uploadError;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .upsert({ id: user.id, avatar_url: filePath, updated_at: new Date().toISOString() });

    if (updateError) {
      showError("Falha ao salvar o novo avatar.");
      console.error(updateError);
      throw updateError;
    }

    // Fetch a new signed URL to display the new avatar immediately
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('avatars')
      .createSignedUrl(filePath, 3600);

    if (signedUrlError) {
      showError("Falha ao carregar a prévia do novo avatar.");
      console.error(signedUrlError);
      setProfile(prev => ({ ...prev, avatarUrl: null }));
    } else {
      setProfile(prev => ({ ...prev, avatarUrl: signedUrlData.signedUrl }));
    }
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