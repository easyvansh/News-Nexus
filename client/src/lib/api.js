const baseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");

const buildUrl = (path, params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return `${baseUrl}${path}${suffix}`;
};

const parseResponse = async (response) => {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = payload?.error || {};
    throw new Error(error.message || "Failed to fetch data");
  }
  return payload;
};

const get = async (path, params) => {
  const response = await fetch(buildUrl(path, params));
  return parseResponse(response);
};

export const fetchArticles = (params) => get("/api/v1/articles", params);
export const fetchHeadlines = (params) => get("/api/v1/headlines", params);
export const fetchSources = () => get("/api/v1/sources");
