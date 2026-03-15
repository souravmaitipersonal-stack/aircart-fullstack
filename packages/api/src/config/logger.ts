// Simple logger utility
export function logInfo(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ℹ️  ${message}`, data || '');
}

export function logSuccess(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ✅ ${message}`, data || '');
}

export function logError(message: string, error?: any) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ❌ ${message}`, error || '');
}

export function logWarn(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  console.warn(`[${timestamp}] ⚠️  ${message}`, data || '');
}
