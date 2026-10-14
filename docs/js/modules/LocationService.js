export default class LocationService {
  async lookup(query) {
    const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Could not find that location.');
    return data;
  }
}
