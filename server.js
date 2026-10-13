import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Keep geocoding on the server so the browser can send a clear User-Agent.
app.get('/api/geocode', async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q) return res.status(400).json({ error: 'Please provide a place to search for.' });
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(q)}`, {
      headers: { 'User-Agent': 'NaijaExplorer/1.0 (educational travel project)' }
    });
    if (!response.ok) throw new Error('Location provider returned an error.');
    const results = await response.json();
    if (!results.length) return res.status(404).json({ error: 'No matching location was found.' });
    res.json({ name: results[0].display_name, lat: Number(results[0].lat), lon: Number(results[0].lon) });
  } catch (error) {
    res.status(502).json({ error: 'Location search is temporarily unavailable.' });
  }
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'Naija Explorer' }));
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.listen(PORT, () => console.log(`Naija Explorer is running at http://localhost:${PORT}`));
