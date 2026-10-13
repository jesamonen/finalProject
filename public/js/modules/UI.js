import Storage from './Storage.js';
import ImageService from './ImageService.js';
import Animation from './Animation.js';
const money = value => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(value);
export default class UI {
  constructor() { this.grid = document.querySelector('#destination-grid'); this.imageService = new ImageService(); }
  renderDestinations(places, favorites, itinerary) {
    this.grid.replaceChildren();
    places.forEach((place, index) => {
      const saved = favorites.includes(place.id), planned = itinerary.has(place.id);
      const article = document.createElement('article'); article.className = 'destination-card reveal'; article.style.setProperty('--delay', `${Math.min(index, 5) * 70}ms`);
      const imageWrap = document.createElement('div'); imageWrap.className = 'card-image-wrap';
      const image = document.createElement('img'); image.src = this.imageService.getImage(place); image.alt = place.alt; image.loading = 'lazy'; imageWrap.append(image);
      const category = document.createElement('span'); category.className = 'category-pill'; category.textContent = place.tag; imageWrap.append(category);
      const fav = document.createElement('button'); fav.className = `favorite-button${saved ? ' is-saved' : ''}`; fav.type = 'button'; fav.textContent = saved ? '♥' : '♡'; fav.setAttribute('aria-label', saved ? `Remove ${place.name} from saved places` : `Save ${place.name}`); fav.dataset.favorite = place.id; imageWrap.append(fav);
      const content = document.createElement('div'); content.className = 'card-content';
      const location = document.createElement('p'); location.className = 'card-location'; location.textContent = `⌖  ${place.state}, Nigeria`;
      const title = document.createElement('h3'); title.textContent = place.name;
      const description = document.createElement('p'); description.className = 'card-description'; description.textContent = place.description;
      const meta = document.createElement('div'); meta.className = 'card-meta'; meta.innerHTML = `<span>◷ ${place.duration}</span><span>From ${money(place.budget)}</span>`;
      const add = document.createElement('button'); add.type = 'button'; add.className = `add-trip-button${planned ? ' added' : ''}`; add.dataset.itinerary = place.id; add.textContent = planned ? '✓ Added to itinerary' : '＋ Add to itinerary'; add.disabled = planned;
      content.append(location, title, description, meta, add); article.append(imageWrap, content); this.grid.append(article);
    });
    document.querySelector('#results-count').textContent = `${places.length} ${places.length === 1 ? 'place' : 'places'} to explore`;
    document.querySelector('#favorite-count').textContent = favorites.length;
    Animation.reveal([...this.grid.querySelectorAll('.reveal')]);
  }
  renderItinerary(manager) {
    const list = document.querySelector('#itinerary-list'); list.replaceChildren();
    if (!manager.items.length) { const empty = document.createElement('li'); empty.className = 'itinerary-empty'; empty.textContent = 'Your trip starts with a place that inspires you.'; list.append(empty); }
    manager.items.forEach((item, index) => {
      const li = document.createElement('li'); li.className = 'itinerary-item';
      const number = document.createElement('span'); number.className = 'stop-number'; number.textContent = String(index + 1).padStart(2, '0');
      const details = document.createElement('div'); details.className = 'stop-details'; const name = document.createElement('strong'); name.textContent = item.name; const state = document.createElement('span'); state.textContent = `${item.state}, Nigeria`; details.append(name, state);
      const cost = document.createElement('span'); cost.className = 'stop-cost'; cost.textContent = money(item.budget);
      const remove = document.createElement('button'); remove.className = 'remove-stop'; remove.type = 'button'; remove.textContent = '×'; remove.setAttribute('aria-label', `Remove ${item.name}`); remove.dataset.removeStop = item.id;
      li.append(number, details, cost, remove); list.append(li);
    });
    document.querySelector('#itinerary-count').textContent = manager.items.length;
    document.querySelector('#budget-display').textContent = money(Number(document.querySelector('#budget-input').value || manager.totalBudget()));
  }
  getFavorites() { return Storage.get('favorites', []); }
  saveFavorites(items) { Storage.set('favorites', items); }
}
