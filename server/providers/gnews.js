const { requestJson } = require("../utils/http");
const { AppError } = require("../utils/errors");
const { normalizeArticle } = require("./normalize");
const { buildQueryString, buildGNewsSearchParams, buildGNewsHeadlinesParams } = require("./queryBuilder");

const BASE_URL = "https://gnews.io/api/v4";

const createGNewsProvider = (config) => {
  const headers = { "X-Api-Key": config.gnewsApiKey };

  const ensureWindow = (page, pageSize) => {
    if (page * pageSize > 1000) {
      throw new AppError("INVALID_PAGINATION", "Requested page exceeds GNews window", 400, {
        page,
        pageSize,
        maxWindow: 1000,
      });
    }
  };

  return {
    name: "gnews",

    async fetchArticles(params) {
      ensureWindow(params.page, params.pageSize);
      const query = buildQueryString(buildGNewsSearchParams(params));
      const url = `${BASE_URL}/search?${query}`;
      const payload = await requestJson(url, {
        headers,
        timeoutMs: config.providerTimeoutMs,
      });

      return {
        totalResults: payload.totalArticles || payload.totalResults || 0,
        articles: (payload.articles || []).map((item) => normalizeArticle(item, "gnews")),
      };
    },

    async fetchHeadlines(params) {
      ensureWindow(params.page, params.pageSize);
      const query = buildQueryString(buildGNewsHeadlinesParams(params));
      const url = `${BASE_URL}/top-headlines?${query}`;
      const payload = await requestJson(url, {
        headers,
        timeoutMs: config.providerTimeoutMs,
      });

      return {
        totalResults: payload.totalArticles || payload.totalResults || 0,
        articles: (payload.articles || []).map((item) => normalizeArticle(item, "gnews")),
      };
    },

    async healthCheck() {
      const query = buildQueryString({ max: 1, lang: "en" });
      const url = `${BASE_URL}/top-headlines?${query}`;
      await requestJson(url, {
        headers,
        timeoutMs: config.providerTimeoutMs,
      });
      return true;
    },
  };
};

module.exports = { createGNewsProvider };
