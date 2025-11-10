type SoundType = 'click' | 'success' | 'error' | 'navigate';

const DEFAULT_THEME = 'nebula';
const SOUND_ENABLED_KEY = 'edukids_sound_enabled';

export const getSoundEnabled = (): boolean => {
  try {
    const raw = localStorage.getItem(SOUND_ENABLED_KEY);
    if (raw === null) return true; // padrão: sons ligados
    return raw === 'true';
  } catch {
    return true;
  }
};

export const setSoundEnabled = (enabled: boolean) => {
  try {
    localStorage.setItem(SOUND_ENABLED_KEY, String(enabled));
  } catch {
    // ignore
  }
};

export const playSound = (type: SoundType) => {
  if (!getSoundEnabled()) return;

  try {
    const soundPath = `/sounds/${DEFAULT_THEME}/${type}.mp3`;
    const audio = new Audio(soundPath);
    audio.volume = 0.3;
    audio.play().catch(() => {
      // autoplay bloqueado: ok ignorar
    });
  } catch (error) {
    console.error("Falha ao tocar o som:", error);
  }
};