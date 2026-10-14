// Uses USD as a pivot because the free reference-rate endpoint is based on USD.
// Rates are indicative, not payment or financial quotes.
export default class CurrencyService {
  async convert(amount, from, to) {
    const value = Number(amount);
    if (!Number.isFinite(value) || value < 0) throw new Error('Enter a valid non-negative amount.');
    if (from === to) return { amount: value, result: value, rate: 1, date: 'same currency' };
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!response.ok) throw new Error('Exchange-rate service is unavailable.');
    const data = await response.json();
    if (data.result !== 'success' || !data.rates?.[from] || !data.rates?.[to]) throw new Error('A rate for one of these currencies is not available.');
    const result = value / data.rates[from] * data.rates[to];
    return { amount: value, result, rate: data.rates[to] / data.rates[from], date: data.time_last_update_utc || 'latest available rate' };
  }
}
