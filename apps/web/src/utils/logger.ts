export const logInfo = (message: string, data?: any) => {
  if (typeof window !== 'undefined') {
    console.log(`[INFO] ${message}`, data || '');
  }
};

export const logError = (message: string, error?: any) => {
  if (typeof window !== 'undefined') {
    console.error(`[ERROR] ${message}`, error || '');
  }
};

export const logWarn = (message: string, data?: any) => {
  if (typeof window !== 'undefined') {
    console.warn(`[WARN] ${message}`, data || '');
  }
};
