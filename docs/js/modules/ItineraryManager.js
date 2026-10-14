import Storage from './Storage.js';
export default class ItineraryManager {
  constructor() { this.items = Storage.get('itinerary', []); }
  has(id) { return this.items.some(item => item.id === id); }
  add(place) { if (this.has(place.id)) return false; this.items.push({ id: place.id, name: place.name, state: place.state, budget: place.budget }); this.save(); return true; }
  remove(id) { this.items = this.items.filter(item => item.id !== id); this.save(); }
  clear() { this.items = []; this.save(); }
  totalBudget() { return this.items.reduce((total, item) => total + Number(item.budget || 0), 0); }
  save() { Storage.set('itinerary', this.items); }
}
