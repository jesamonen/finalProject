const PREFIX = 'naija-explorer:';
export default class Storage {
  static get(key, fallback) {
    try { const value = localStorage.getItem(PREFIX + key); return value === null ? fallback : JSON.parse(value); }
    catch { return fallback; }
  }
  static set(key, value) { try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch { /* storage may be disabled */ } }
}
