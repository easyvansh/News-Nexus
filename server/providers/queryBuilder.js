const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });
  return searchParams.toString();
};

const buildGNewsSearchParams = ({ query, page, pageSize, sortBy, lang, country, from, to }) => ({
  q: query,
  page,
  max: pageSize,
  sortby: sortBy || "publishedAt",
  lang,
  country,
  from,
  to,
});

const buildGNewsHeadlinesParams = ({ category, page, pageSize, lang, country }) => ({
  category,
  page,
  max: pageSize,
  lang,
  country,
});

const buildNewsApiEverythingParams = ({ query, page, pageSize, sortBy, lang, from, to }) => ({
  q: query,
  page,
  pageSize,
  sortBy: sortBy || "publishedAt",
  language: lang,
  from,
  to,
});

const buildNewsApiHeadlinesParams = ({ category, page, pageSize, lang, country }) => ({
  category,
  page,
  pageSize,
  language: lang,
  country,
});

module.exports = {
  buildQueryString,
  buildGNewsSearchParams,
  buildGNewsHeadlinesParams,
  buildNewsApiEverythingParams,
  buildNewsApiHeadlinesParams,
};
