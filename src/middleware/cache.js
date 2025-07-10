const apicache = require("apicache");
const cache = apicache.middleware;

function cacheMiddleware(duration = "5 minutes") {
  console.log("🚀 ~ cacheMiddleware ~ cacheMiddleware:");
  return cache(duration);
}

module.exports = cacheMiddleware;
