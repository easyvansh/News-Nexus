const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseOrigins = (value = "") =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const loadConfig = () => {
  const version = require("../package.json").version;
  const config = {
    version,
    nodeEnv: process.env.NODE_ENV || "development",
    port: toInt(process.env.PORT, 8080),
    newsProvider: (process.env.NEWS_PROVIDER || "gnews").toLowerCase(),
    gnewsApiKey: process.env.GNEWS_API_KEY || "",
    newsApiKey: process.env.NEWSAPI_API_KEY || "",
    corsOrigins: parseOrigins(process.env.CORS_ORIGIN || ""),
    rateLimitWindowMs: toInt(process.env.RATE_LIMIT_WINDOW_MS, 60000),
    rateLimitMax: toInt(process.env.RATE_LIMIT_MAX, 60),
    cacheHeadlinesTtlS: toInt(process.env.CACHE_HEADLINES_TTL_S, 120),
    cacheArticlesTtlS: toInt(process.env.CACHE_ARTICLES_TTL_S, 60),
    providerTimeoutMs: 5000,
  };

  if (config.newsProvider === "gnews" && !config.gnewsApiKey) {
    throw new Error("Missing required env var: GNEWS_API_KEY");
  }

  if (config.newsProvider === "newsapi" && !config.newsApiKey) {
    throw new Error("Missing required env var: NEWSAPI_API_KEY");
  }

  return config;
};

module.exports = { loadConfig };
