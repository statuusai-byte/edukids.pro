import { toast } from "sonner";
import { playSound } from "./sound";

export const showSuccess = (message: string) => {
  toast.success(message);
  playSound('success');
};

export const showError = (message: string) => {
  toast.error(message);
  playSound('error');
};

export const showLoading = (message: string) => {
  return toast.loading(message);
};

export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};