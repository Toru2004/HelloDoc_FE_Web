import { toast } from 'vue3-toastify';

export const useNotification = () => {
  const notifySuccess = (message: string, duration?: number) => {
    toast.success(message, {
      autoClose: duration || 5000,
    });
  };

  const notifyFailed = (message: string, duration?: number) => {
    toast.error(message, {
      autoClose: duration || 5000,
    });
  };

  const notifyInfo = (message: string, duration?: number) => {
    toast.info(message, {
      autoClose: duration || 5000,
    });
  };

  const notifyWarning = (message: string, duration?: number) => {
    toast.warning(message, {
      autoClose: duration || 5000,
    });
  };

  return {
    notifySuccess,
    notifyFailed,
    notifyInfo,
    notifyWarning,
  };
};
