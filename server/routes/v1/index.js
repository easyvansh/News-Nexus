const express = require("express");
const { asyncHandler } = require("../../middleware/asyncHandler");
const { AppError } = require("../../utils/errors");
const { validatePagination, validateCategory } = require("../../utils/validation");
const { createCacheKey } = require("../../utils/cache");
const { dedupArticles, filterByAllowlist, rankArticles } = require("../../utils/quality");

const sources = require("../../data/sources.json");
const sourceAllowlist = require("../../data/sourceAllowlist.json");

const router = express.Router();

router.use((req, _res, next) => {
  req.app.locals.metrics.increment("requests");
  next();
});

router.get(
  "/articles",
  asyncHandler(async (req, res) => {
    const { provider, cache, config, metrics } = req.app.locals;
    const { query, sortBy = "publishedAt", lang = "en", country = "", from, to } = req.query;

    if (!query || !query.trim()) {
      throw new AppError("MISSING_PARAM", "query is required", 400, { param: "query" });
    }

    const { page, pageSize } = validatePagination({
      page: req.query.page,
      pageSize: req.query.pageSize,
    });

    const params = {
      query: query.trim(),
      sortBy,
      lang,
      country,
      from,
      to,
      page,
      pageSize,
    };

    const cacheKey = createCacheKey(provider.name, "articles", params);
    const cached = cache.get(cacheKey);
    if (cached) {
      metrics.increment("cacheHits");
      return res.json(cached);
    }
    metrics.increment("cacheMisses");

    const started = Date.now();
    const providerData = await provider.fetchArticles(params);
    let articles = dedupArticles(providerData.articles || []);
    articles = filterByAllowlist(articles, sourceAllowlist, false);
    articles = rankArticles(articles, { query: query.trim(), allowlist: sourceAllowlist }).map(({ score, ...article }) => article);

    const response = {
      data: {
        totalResults: providerData.totalResults || articles.length,
        articles,
      },
      meta: {
        provider: provider.name,
        latencyMs: Date.now() - started,
      },
    };

    cache.set(cacheKey, response, config.cacheArticlesTtlS);
    res.json(response);
  })
);

router.get(
  "/headlines",
  asyncHandler(async (req, res) => {
    const { provider, cache, config, metrics } = req.app.locals;
    const category = validateCategory(req.query.category || "general");
    const { page, pageSize } = validatePagination({
      page: req.query.page,
      pageSize: req.query.pageSize,
    });

    const params = {
      category,
      country: req.query.country || "",
      lang: req.query.lang || "en",
      page,
      pageSize,
    };

    const cacheKey = createCacheKey(provider.name, "headlines", params);
    const cached = cache.get(cacheKey);
    if (cached) {
      metrics.increment("cacheHits");
      return res.json(cached);
    }
    metrics.increment("cacheMisses");

    const started = Date.now();
    const providerData = await provider.fetchHeadlines(params);
    let articles = dedupArticles(providerData.articles || []);
    articles = filterByAllowlist(articles, sourceAllowlist, false);
    articles = rankArticles(articles, { query: category, allowlist: sourceAllowlist }).map(({ score, ...article }) => article);

    const response = {
      data: {
        totalResults: providerData.totalResults || articles.length,
        articles,
      },
      meta: {
        provider: provider.name,
        latencyMs: Date.now() - started,
      },
    };

    cache.set(cacheKey, response, config.cacheHeadlinesTtlS);
    res.json(response);
  })
);

router.get("/sources", (_req, res) => {
  res.json({
    data: sources,
    meta: { provider: "curated-static-list" },
  });
});

router.get(
  "/health",
  asyncHandler(async (req, res) => {
    const { provider, cache, version, metrics } = req.app.locals;
    const cacheKey = createCacheKey(provider.name, "health", { probe: true });
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    let providerReachable = true;
    try {
      await provider.healthCheck();
    } catch (_error) {
      providerReachable = false;
      metrics.increment("providerErrors");
    }

    const response = {
      status: "ok",
      provider: provider.name,
      version,
      providerReachable,
      cache: cache.stats(),
      metrics: metrics.snapshot(),
    };

    cache.set(cacheKey, response, 30);
    res.json(response);
  })
);

module.exports = router;
