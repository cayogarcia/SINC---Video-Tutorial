import CryptoJS from 'crypto-js';

// Secret key for encryption/decryption - em produção, isso deve estar num env seguro
const SECRET_KEY = '@sinc@';

/**
 * Encrypt data before storing it
 */
const encrypt = <T>(data: T): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

/**
 * Decrypt data after retrieving from storage
 */
const decrypt = <T>(encryptedData: string): T | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    const parsed = JSON.parse(decryptedString);
    return parsed as T;
  } catch (error) {
    console.error('Failed to decrypt data:', error);
    return null;
  }
};

/**
 * Set data in localStorage with encryption
 */
export const setStorageItem = <T>(key: string, data: T): void => {
  try {
    if (data === undefined) {
      throw new Error('Cannot store undefined value');
    }
    const encryptedData = encrypt(data);
    localStorage.setItem(key, encryptedData);
  } catch (error) {
    console.error(`Error storing ${key}:`, error);
  }
};

/**
 * Get data from localStorage with decryption
 */
export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const encryptedData = localStorage.getItem(key);
    if (!encryptedData) return defaultValue;

    const decryptedData = decrypt<T>(encryptedData);
    if (decryptedData === null || decryptedData === undefined) {
      return defaultValue;
    }
    return decryptedData;
  } catch (error) {
    console.error(`Error retrieving ${key}:`, error);
    return defaultValue;
  }
};

/**
 * Remove item from localStorage
 */
export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key}:`, error);
  }
};

