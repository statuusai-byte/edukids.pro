type SoundType = 'click' | 'success' | 'error' | 'navigate';

const DEFAULT_THEME = 'nebula';

export const playSound = (type: SoundType) => {
  try {
    // O tema é fixo agora, então usamos o caminho padrão
    const soundPath = `/sounds/${DEFAULT_THEME}/${type}.mp3`;
    const audio = new Audio(soundPath);
    audio.volume = 0.3; // Sons de UI devem ser sutis
    audio.play().catch(() => {
      // O usuário pode não ter interagido com a página ainda, o que impede a reprodução automática.
      // Isso é esperado e não precisa de um log de erro.
    });
  } catch (error) {
    console.error("Falha ao tocar o som:", error);
  }
};