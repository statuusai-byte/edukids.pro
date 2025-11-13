const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    const filePath = path.join(process.cwd(), 'public', 'icons', 'icon-512.png');
    if (!fs.existsSync(filePath)) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('Icon not found');
      return;
    }

    const data = fs.readFileSync(filePath);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.statusCode = 200;
    res.end(data);
  } catch (err) {
    console.error('Error serving icon-512:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Internal server error');
  }
};