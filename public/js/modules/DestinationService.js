import { destinations } from '../data/destinations.js';
export default class DestinationService {
  getAll() { return [...destinations]; }
  getById(id) { return destinations.find(place => place.id === id) || null; }
  search({ query = '', category = 'all', state = 'all' } = {}) {
    const term = query.trim().toLowerCase();
    return destinations.filter(place => {
      const matchesTerm = !term || [place.name, place.state, place.category, place.tag, place.description].some(value => value.toLowerCase().includes(term));
      return matchesTerm && (category === 'all' || place.category === category) && (state === 'all' || place.state === state);
    });
  }
  getStates() { return [...new Set(destinations.map(place => place.state))].sort(); }
}
