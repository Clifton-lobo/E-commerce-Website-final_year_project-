module.exports = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    if (Object.keys(req.body).length > 0) {
      console.log('Body:', req.body);
    }
    next();
  };