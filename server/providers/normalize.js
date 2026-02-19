const toIsoString = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const normalizeGNewsArticle = (raw = {}) => ({
  title: raw.title || "",
  description: raw.description || null,
  content: raw.content || null,
  url: raw.url || "",
  imageUrl: raw.image || null,
  publishedAt: toIsoString(raw.publishedAt),
  source: {
    name: raw?.source?.name || "Unknown",
    url: raw?.source?.url || "",
  },
});

const normalizeNewsApiArticle = (raw = {}) => ({
  title: raw.title || "",
  description: raw.description || null,
  content: raw.content || null,
  url: raw.url || "",
  imageUrl: raw.urlToImage || null,
  publishedAt: toIsoString(raw.publishedAt),
  source: {
    name: raw?.source?.name || "Unknown",
    url: raw?.source?.url || "",
  },
});

const normalizeArticle = (raw, provider) => {
  if (provider === "newsapi") return normalizeNewsApiArticle(raw);
  return normalizeGNewsArticle(raw);
};

module.exports = {
  normalizeArticle,
  normalizeGNewsArticle,
  normalizeNewsApiArticle,
};
