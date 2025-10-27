import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface Profile {
  name: string;
  avatarUrl: string | null;
}

interface ProfileContextType extends Profile {
  setName: (name: string) => void;
  setAvatarUrl: (url: string | null) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const DEFAULT_PROFILE: Profile = {
  name: 'Alex',
  avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
};

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('edukids_profile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
    } catch (error) {
      console.error("Failed to load profile from localStorage", error);
    }
  }, []);

  const updateProfile = (newProfile: Partial<Profile>) => {
    setProfile(prev => {
      const updated = { ...prev, ...newProfile };
      try {
        localStorage.setItem('edukids_profile', JSON.stringify(updated));
      } catch (error) {
        console.error("Failed to save profile to localStorage", error);
      }
      return updated;
    });
  };

  const setName = (name: string) => updateProfile({ name });
  const setAvatarUrl = (avatarUrl: string | null) => updateProfile({ avatarUrl });

  return (
    <ProfileContext.Provider value={{ ...profile, setName, setAvatarUrl }}>
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