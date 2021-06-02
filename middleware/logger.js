const logger = (req, res, next) => {
  console.log(`${req.protocol}://${req.get("host")}${req.originalUrl}`); // whole url
  console.log("hello");
  next();
};

module.exports = logger;
