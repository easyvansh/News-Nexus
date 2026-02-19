const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const routesV1 = require("./routes/v1");
const { createProvider } = require("./providers");
const { createCacheStore } = require("./utils/cache");
const { loadConfig } = require("./utils/config");
const { createMetricsStore } = require("./utils/metrics");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const config = loadConfig();
const provider = createProvider(config.newsProvider, config);
const cache = createCacheStore();
const metrics = createMetricsStore();

const app = express();

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (config.nodeEnv === "production" && config.corsOrigins.length === 0) {
      callback(new Error("CORS_ORIGIN must be configured in production"));
      return;
    }

    if (config.corsOrigins.length === 0 || config.corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Origin not allowed by CORS"));
  },
};

app.use(cors(corsOptions));
app.use(express.json());

const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  handler(_req, res) {
    res.status(429).json({
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many requests, please try again later.",
        details: {},
      },
    });
  },
});

app.use(limiter);

app.locals.config = config;
app.locals.provider = provider;
app.locals.cache = cache;
app.locals.metrics = metrics;
app.locals.version = config.version;

app.use("/api/v1", routesV1);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
