const { requestJson } = require("../utils/http");
const { normalizeArticle } = require("./normalize");
const { buildQueryString, buildNewsApiEverythingParams, buildNewsApiHeadlinesParams } = require("./queryBuilder");

const BASE_URL = "https://newsapi.org/v2";

const createNewsApiProvider = (config) => {
  const headers = { "X-Api-Key": config.newsApiKey };

  return {
    name: "newsapi",

    async fetchArticles(params) {
      const query = buildQueryString(buildNewsApiEverythingParams(params));
      const url = `${BASE_URL}/everything?${query}`;
      const payload = await requestJson(url, {
        headers,
        timeoutMs: config.providerTimeoutMs,
      });

      return {
        totalResults: payload.totalResults || 0,
        articles: (payload.articles || []).map((item) => normalizeArticle(item, "newsapi")),
      };
    },

    async fetchHeadlines(params) {
      const query = buildQueryString(buildNewsApiHeadlinesParams(params));
      const url = `${BASE_URL}/top-headlines?${query}`;
      const payload = await requestJson(url, {
        headers,
        timeoutMs: config.providerTimeoutMs,
      });

      return {
        totalResults: payload.totalResults || 0,
        articles: (payload.articles || []).map((item) => normalizeArticle(item, "newsapi")),
      };
    },

    async healthCheck() {
      const query = buildQueryString({ pageSize: 1, country: "us" });
      const url = `${BASE_URL}/top-headlines?${query}`;
      await requestJson(url, {
        headers,
        timeoutMs: config.providerTimeoutMs,
      });
      return true;
    },
  };
};

module.exports = { createNewsApiProvider };
