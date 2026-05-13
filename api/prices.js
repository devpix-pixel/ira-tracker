export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const apiKey = process.env.POLYGON_API_KEY;
  const tickers = ['DTCR', 'MLPX', 'IDGT', 'TRFK', 'SMH', 'SOXX', 'VTI'];
  
  try {
    const results = await Promise.all(
      tickers.map(ticker =>
        fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${apiKey}`)
          .then(r => r.json())
          .then(data => ({ ticker, price: data.results?.[0]?.c ?? null }))
      )
    );
    const prices = Object.fromEntries(results.map(r => [r.ticker, r.price]));
    res.status(200).json(prices);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
