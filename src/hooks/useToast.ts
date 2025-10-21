import toast from 'react-hot-toast';

const TOAST_IDS = {
  LOGIN_SUCCESS: 'login-success',
  LOGIN_ERROR: 'login-error',
  REGISTER_SUCCESS: 'register-success',
  REGISTER_ERROR: 'register-error',
  LOGOUT_SUCCESS: 'logout-success',
  LOGOUT_ERROR: 'logout-error',
} as const;

export const useToast = () => {
  const success = (message: string, id?: string) => {
    if (id && TOAST_IDS[id as keyof typeof TOAST_IDS]) {
      toast.dismiss(TOAST_IDS[id as keyof typeof TOAST_IDS]);
      return toast.success(message, { id: TOAST_IDS[id as keyof typeof TOAST_IDS] });
    }
    return toast.success(message);
  };

  const error = (message: string, id?: string) => {
    if (id && TOAST_IDS[id as keyof typeof TOAST_IDS]) {
      toast.dismiss(TOAST_IDS[id as keyof typeof TOAST_IDS]);
      return toast.error(message, { id: TOAST_IDS[id as keyof typeof TOAST_IDS] });
    }
    return toast.error(message);
  };

  const loading = (message: string, id?: string) => {
    if (id && TOAST_IDS[id as keyof typeof TOAST_IDS]) {
      toast.dismiss(TOAST_IDS[id as keyof typeof TOAST_IDS]);
      return toast.loading(message, { id: TOAST_IDS[id as keyof typeof TOAST_IDS] });
    }
    return toast.loading(message);
  };

  return {
    success,
    error,
    loading,
    dismiss: (toastId?: string) => toast.dismiss(toastId),
  };
};
