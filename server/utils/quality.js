const stripPunctuation = (value = "") => value.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();

const normalizedUrl = (value = "") => {
  try {
    const parsed = new URL(value);
    const removableParams = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "ref"];
    removableParams.forEach((param) => parsed.searchParams.delete(param));
    parsed.hash = "";
    return parsed.toString();
  } catch (_error) {
    return value;
  }
};

const hostFromUrl = (value = "") => {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch (_error) {
    return "";
  }
};

const dedupArticles = (articles = []) => {
  const seenUrls = new Set();
  const seenTitles = new Set();

  return articles.filter((article) => {
    const urlKey = normalizedUrl(article.url);
    const titleKey = stripPunctuation(article.title);
    if (seenUrls.has(urlKey) || seenTitles.has(titleKey)) {
      return false;
    }
    seenUrls.add(urlKey);
    seenTitles.add(titleKey);
    return true;
  });
};

const scoreRelevance = (article, query = "") => {
  const terms = stripPunctuation(query).split(" ").filter((term) => term.length > 2);
  if (terms.length === 0) return 0.5;
  const content = stripPunctuation(`${article.title || ""} ${article.description || ""}`);
  const matches = terms.filter((term) => content.includes(term)).length;
  return Math.min(1, matches / terms.length);
};

const scoreRecency = (publishedAt) => {
  if (!publishedAt) return 0.3;
  const ageMs = Date.now() - new Date(publishedAt).getTime();
  if (!Number.isFinite(ageMs) || ageMs < 0) return 0.3;
  const oneDayMs = 24 * 60 * 60 * 1000;
  const days = ageMs / oneDayMs;
  return Math.max(0, Math.min(1, 1 - days / 14));
};

const scoreSource = (article, allowlist) => {
  const domain = hostFromUrl(article.url);
  const byDomain = allowlist?.domains?.[domain];
  if (typeof byDomain === "number") return byDomain;
  const bySourceName = allowlist?.sourceNames?.[article?.source?.name];
  if (typeof bySourceName === "number") return bySourceName;
  return 0.45;
};

const filterByAllowlist = (articles, allowlist, strictMode = false) => {
  if (!strictMode) return articles;
  return articles.filter((article) => {
    const domain = hostFromUrl(article.url);
    return allowlist?.domains?.[domain] || allowlist?.sourceNames?.[article?.source?.name];
  });
};

const rankArticles = (articles, options = {}) => {
  const { query = "", allowlist = {}, engagementScore = 0.3 } = options;
  return [...articles]
    .map((article) => {
      const relevance = scoreRelevance(article, query);
      const recency = scoreRecency(article.publishedAt);
      const source = scoreSource(article, allowlist);
      const score = 0.45 * relevance + 0.3 * recency + 0.2 * source + 0.05 * engagementScore;
      return { ...article, score };
    })
    .sort((a, b) => b.score - a.score);
};

module.exports = {
  dedupArticles,
  rankArticles,
  filterByAllowlist,
};
