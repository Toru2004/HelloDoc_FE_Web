import { ref } from 'vue';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  icon?: 'warning' | 'info' | 'success' | 'error';
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export const useConfirm = () => {
  const isOpen = ref(false);
  const title = ref('');
  const message = ref('');
  const confirmText = ref('Xác nhận');
  const cancelText = ref('Hủy');
  const confirmButtonClass = ref('bg-blue-600 hover:bg-blue-700');
  const icon = ref<'warning' | 'info' | 'success' | 'error'>('info');
  
  let confirmCallback: (() => void | Promise<void>) | null = null;
  let cancelCallback: (() => void) | null = null;

  const confirm = (options: ConfirmOptions) => {
    title.value = options.title;
    message.value = options.message;
    confirmText.value = options.confirmText || 'Xác nhận';
    cancelText.value = options.cancelText || 'Hủy';
    confirmButtonClass.value = options.confirmButtonClass || 'bg-blue-600 hover:bg-blue-700';
    icon.value = options.icon || 'info';
    confirmCallback = options.onConfirm;
    cancelCallback = options.onCancel || null;
    isOpen.value = true;
  };

  const handleConfirm = async () => {
    if (confirmCallback) {
      await confirmCallback();
    }
    close();
  };

  const handleCancel = () => {
    if (cancelCallback) {
      cancelCallback();
    }
    close();
  };

  const close = () => {
    isOpen.value = false;
    title.value = '';
    message.value = '';
    confirmCallback = null;
    cancelCallback = null;
  };

  return {
    // State
    isOpen,
    title,
    message,
    confirmText,
    cancelText,
    confirmButtonClass,
    icon,
    
    // Methods
    confirm,
    handleConfirm,
    handleCancel,
    close,
  };
};
