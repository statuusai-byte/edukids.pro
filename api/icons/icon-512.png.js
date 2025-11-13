module.exports = async (req, res) => {
  try {
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const url = `${proto}://${host}/icons/icon-512.png`;

    const fetched = await fetch(url);
    if (!fetched.ok) {
      res.statusCode = fetched.status || 502;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end(`Failed to fetch the icon (status ${fetched.status})`);
      return;
    }

    const arrayBuffer = await fetched.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.statusCode = 200;
    res.setHeader('Content-Type', fetched.headers.get('content-type') || 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.end(buffer);
  } catch (err) {
    console.error('Error proxying icon-512:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Internal server error');
  }
};