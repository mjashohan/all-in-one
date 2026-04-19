// Platform-agnostic storage wrapper.
//
// On web this delegates to localStorage. When you migrate to React Native,
// swap the three internals to use @react-native-async-storage/async-storage
// (and make them async — the rest of the app already awaits these calls).
//
// Keeping this file as the *only* place that touches web APIs means the
// AuthContext and API client don't need to change on the RN migration.

const storage = {
  async getItem(key) {
    try {
      return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
    } catch {
      return null;
    }
  },
  async setItem(key, value) {
    try {
      if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
    } catch {
      /* ignore quota / privacy-mode errors */
    }
  },
  async removeItem(key) {
    try {
      if (typeof window !== 'undefined') window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
  // Synchronous helpers for the axios interceptor (which can't await).
  // On RN, replace these with a small in-memory cache populated at boot.
  getItemSync(key) {
    try {
      return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
    } catch {
      return null;
    }
  },
};

export default storage;
