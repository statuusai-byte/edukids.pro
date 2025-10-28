import confetti from "canvas-confetti";

export function triggerConfetti() {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      startVelocity: 30,
      ticks: 200,
      origin: { y: 0.35 },
      gravity: 0.6,
    });
  } catch (e) {
    // Silent fail: confetti is non-essential
    // console.warn("Confetti failed:", e);
  }
}