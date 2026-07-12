const StorageService = {
  get(key, defaultValue = null) {
    const data = localStorage.getItem(key);

    if (!data) {
      return defaultValue;
    }

    try {
      return JSON.parse(data);
    } catch (error) {
      console.error(`Erro ao ler ${key}`, error);
      return defaultValue;
    }
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  clear() {
    localStorage.clear();
  },
};
