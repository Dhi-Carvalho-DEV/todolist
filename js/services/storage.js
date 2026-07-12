/**
 * Serviço central de armazenameento
 * Responsável por controlar o localStorage da aplicação
 */

export function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getData(key, fallback = null) {
  const data = localStorage.getItem(key);

  if (!data) {
    return fallback;
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error(`Erro ao ler ${key}`, error);
    return fallback;
  }
}

export function removeData(key) {
  localStorage.removeItem(key);
}

export function clearStorage() {
  localStorage.clear();
}
