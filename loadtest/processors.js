module.exports = {
  // Example hook to randomize or set headers if needed later
  beforeRequest: (req, context, ee, next) => {
    return next();
  },
};
