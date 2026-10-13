import DestinationService from './modules/DestinationService.js';
import ItineraryManager from './modules/ItineraryManager.js';
import CurrencyService from './modules/CurrencyService.js';
import LocationService from './modules/LocationService.js';
import UI from './modules/UI.js';
import Animation from './modules/Animation.js';

const destinations = new DestinationService();
const itinerary = new ItineraryManager();
const currency = new CurrencyService();
const locationService = new LocationService();
const ui = new UI();
let favoritesOnly = false;
const controls = { query: document.querySelector('#search-input'), category: document.querySelector('#category-filter'), state: document.querySelector('#state-filter') };

function render() {
  let places = destinations.search({ query: controls.query.value, category: controls.category.value, state: controls.state.value });
  if (favoritesOnly) places = places.filter(place => ui.getFavorites().includes(place.id));
  ui.renderDestinations(places, ui.getFavorites(), itinerary);
  ui.renderItinerary(itinerary);
}
function populateStates() {
  destinations.getStates().forEach(state => { const option = document.createElement('option'); option.value = state; option.textContent = state; controls.state.append(option); });
}

populateStates(); document.querySelector('#year').textContent = new Date().getFullYear();
render();
Object.values(controls).forEach(control => control.addEventListener('input', () => { favoritesOnly = false; document.querySelector('#show-favorites').classList.remove('active'); render(); }));
document.querySelector('#clear-search').addEventListener('click', () => { controls.query.value = ''; render(); controls.query.focus(); });
document.querySelector('#show-favorites').addEventListener('click', event => { favoritesOnly = !favoritesOnly; event.currentTarget.classList.toggle('active', favoritesOnly); render(); document.querySelector('#discover').scrollIntoView({ behavior: 'smooth' }); });
document.querySelector('#destination-grid').addEventListener('click', event => {
  const favoriteButton = event.target.closest('[data-favorite]');
  const itineraryButton = event.target.closest('[data-itinerary]');
  if (favoriteButton) {
    const id = favoriteButton.dataset.favorite; let saved = ui.getFavorites();
    saved = saved.includes(id) ? saved.filter(item => item !== id) : [...saved, id]; ui.saveFavorites(saved); render();
    Animation.toast(saved.includes(id) ? 'Place saved for later.' : 'Place removed from saved places.');
  }
  if (itineraryButton) {
    const place = destinations.getById(itineraryButton.dataset.itinerary);
    if (place && itinerary.add(place)) { render(); Animation.toast('Added to your itinerary.'); }
  }
});
document.querySelector('#itinerary-list').addEventListener('click', event => { const button = event.target.closest('[data-remove-stop]'); if (button) { itinerary.remove(button.dataset.removeStop); render(); } });
document.querySelector('#clear-itinerary').addEventListener('click', () => { itinerary.clear(); render(); Animation.toast('Your itinerary has been cleared.'); });
document.querySelector('#budget-input').addEventListener('input', () => { document.querySelector('#budget-display').textContent = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(Number(document.querySelector('#budget-input').value || 0)); });
document.querySelector('#export-itinerary').addEventListener('click', () => {
  if (!itinerary.items.length) { Animation.toast('Add at least one destination first.'); return; }
  const budget = document.querySelector('#budget-input').value || itinerary.totalBudget();
  const content = ['NAIJA EXPLORER — MY ITINERARY', '', ...itinerary.items.map((item, index) => `${index + 1}. ${item.name} — ${item.state}, Nigeria — estimated ₦${Number(item.budget).toLocaleString('en-NG')}`), '', `Planned budget: ₦${Number(budget).toLocaleString('en-NG')}`, '', 'Note: Cost estimates are illustrative. Confirm transport, opening times, entry fees, and safety information before travel.'].join('\n');
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'naija-explorer-itinerary.txt'; link.click(); URL.revokeObjectURL(url);
});
document.querySelector('#location-form').addEventListener('submit', async event => {
  event.preventDefault(); const output = document.querySelector('#location-result'); const query = document.querySelector('#location-input').value.trim(); output.textContent = 'Searching…';
  try { const place = await locationService.lookup(query); output.textContent = `${place.name}\nCoordinates: ${place.lat.toFixed(5)}, ${place.lon.toFixed(5)}`; }
  catch (error) { output.textContent = error.message; }
});
document.querySelector('#currency-form').addEventListener('submit', async event => {
  event.preventDefault(); const output = document.querySelector('#currency-result'); output.textContent = 'Getting the latest available reference rate…';
  try { const result = await currency.convert(document.querySelector('#currency-amount').value, document.querySelector('#currency-from').value, document.querySelector('#currency-to').value); output.textContent = `${result.amount.toLocaleString()} ${document.querySelector('#currency-from').value} ≈ ${result.result.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${document.querySelector('#currency-to').value}. Indicative rate; confirm before spending.`; }
  catch (error) { output.textContent = `${error.message} Please try again later.`; }
});
