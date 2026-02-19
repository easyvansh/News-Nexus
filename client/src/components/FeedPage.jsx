import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchArticles, fetchHeadlines } from "../lib/api";
import Card from "./Card";
import countries from "./countries";

const defaultFilters = {
  query: "latest",
  category: "general",
  country: "",
  lang: "en",
  sortBy: "publishedAt",
  page: "1",
  pageSize: "10",
};

const SkeletonCards = () => (
  <div className="cards cards-loading">
    {Array.from({ length: 6 }).map((_, idx) => (
      <div className="everything-card skeleton-card p-5" key={idx} aria-hidden>
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-image" />
        <div className="skeleton-line" />
        <div className="skeleton-line skeleton-short" />
      </div>
    ))}
  </div>
);

const FeedPage = ({ mode = "articles", routeCategory = "", routeCountry = "" }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [queryInput, setQueryInput] = useState(searchParams.get("query") || defaultFilters.query);

  const filters = useMemo(
    () => ({
      query: searchParams.get("query") || defaultFilters.query,
      category: routeCategory || searchParams.get("category") || defaultFilters.category,
      country: routeCountry || searchParams.get("country") || defaultFilters.country,
      lang: searchParams.get("lang") || defaultFilters.lang,
      sortBy: searchParams.get("sortBy") || defaultFilters.sortBy,
      page: Number.parseInt(searchParams.get("page") || defaultFilters.page, 10),
      pageSize: Number.parseInt(searchParams.get("pageSize") || defaultFilters.pageSize, 10),
    }),
    [routeCategory, routeCountry, searchParams]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (queryInput !== filters.query) {
        const next = new URLSearchParams(searchParams);
        next.set("query", queryInput || "latest");
        next.set("page", "1");
        setSearchParams(next);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [filters.query, queryInput, searchParams, setSearchParams]);

  useEffect(() => {
    const run = async () => {
      setIsLoading(true);
      setError("");
      try {
        const payload =
          mode === "headlines"
            ? await fetchHeadlines({
                category: filters.category,
                country: filters.country,
                lang: filters.lang,
                page: filters.page,
                pageSize: filters.pageSize,
              })
            : await fetchArticles({
                query: filters.query,
                sortBy: filters.sortBy,
                lang: filters.lang,
                country: filters.country,
                page: filters.page,
                pageSize: filters.pageSize,
              });

        setData(payload?.data?.articles || []);
        setTotalResults(payload?.data?.totalResults || 0);
      } catch (fetchError) {
        setData([]);
        setError(fetchError.message || "Failed to fetch news.");
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, [filters, mode, retryCount]);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    next.set(key, value);
    next.set("page", "1");
    setSearchParams(next);
  };

  const handlePrev = () => {
    const nextPage = Math.max(1, filters.page - 1);
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
  };

  const handleNext = () => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(filters.page + 1));
    setSearchParams(next);
  };

  const canGoNext = data.length >= filters.pageSize;
  const heading = mode === "headlines" ? "Top Headlines" : "Everything Feed";
  const activeScope = routeCountry ? `Country: ${routeCountry.toUpperCase()}` : routeCategory ? `Category: ${routeCategory}` : "Global";
  const featured = data[0];
  const remaining = data.slice(1);

  return (
    <>
      <section className="hero-section">
        <div className="hero-content clean-hero">
          <p className="hero-kicker">Daily Briefing</p>
          <h1>{heading}</h1>
          <p className="hero-subtitle">Read clean, fast and focused coverage with practical filters and reliable sources.</p>
          <div className="hero-chips">
            <span className="hero-chip">{activeScope}</span>
            <span className="hero-chip">{totalResults > 0 ? `${totalResults} results` : "Fresh updates"}</span>
            <span className="hero-chip">Page {filters.page}</span>
          </div>
        </div>
      </section>

      <section className="filters-panel modern-filters">
        <label className="filter-field filter-large search-field">
          <span>Search</span>
          <input
            type="text"
            value={queryInput}
            onChange={(event) => setQueryInput(event.target.value)}
            placeholder="Search topics, companies, regions..."
            className="search-box border rounded px-3"
          />
        </label>

        {mode === "headlines" && !routeCategory && (
          <label className="filter-field">
            <span>Category</span>
            <select value={filters.category} onChange={(event) => updateFilter("category", event.target.value)}>
              {["general", "world", "nation", "business", "technology", "entertainment", "sports", "science", "health"].map(
                (option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                )
              )}
            </select>
          </label>
        )}

        {!routeCountry && (
          <label className="filter-field">
            <span>Country</span>
            <select value={filters.country} onChange={(event) => updateFilter("country", event.target.value.toLowerCase())}>
              <option value="">Global</option>
              {countries.map((country) => (
                <option key={country.iso_2_alpha} value={country.iso_2_alpha.toLowerCase()}>
                  {country.countryName}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="filter-field">
          <span>Language</span>
          <select value={filters.lang} onChange={(event) => updateFilter("lang", event.target.value)}>
            <option value="en">en</option>
            <option value="hi">hi</option>
            <option value="fr">fr</option>
          </select>
        </label>

        {mode === "articles" && (
          <label className="filter-field">
            <span>Sort</span>
            <select value={filters.sortBy} onChange={(event) => updateFilter("sortBy", event.target.value)}>
              <option value="publishedAt">publishedAt</option>
              <option value="relevance">relevance</option>
            </select>
          </label>
        )}
      </section>

      {isLoading && <SkeletonCards />}

      {!isLoading && error && (
        <div className="state-box state-error">
          <p>{error}</p>
          <button className="pagination-btn" onClick={() => setRetryCount((value) => value + 1)}>
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && data.length === 0 && (
        <div className="state-box state-empty">
          <p>No articles found. Try broader keywords, another country, or reset filters.</p>
        </div>
      )}

      {!isLoading && !error && data.length > 0 && (
        <>
          <section className="featured-story">
            <a href={featured.url} target="_blank" rel="noreferrer" className="featured-anchor" aria-label={`Open featured article: ${featured.title}`}>
              <article className="featured-card">
                <div className="featured-image-wrap">
                  <img
                    src={featured.imageUrl || "https://placehold.co/1200x640?text=Lead+Story"}
                    alt={featured.title}
                    className="featured-image"
                  />
                </div>
                <div className="featured-meta">
                  <span className="hero-chip">{activeScope}</span>
                  <span className="hero-chip">Lead Story</span>
                </div>
                <h2 className="featured-title">{featured.title}</h2>
                <p className="featured-description">{(featured.description || "").substring(0, 220)}</p>
                <p className="featured-footer">
                  Source: {featured.source?.name || "Unknown"} • {(featured.publishedAt || "").substring(0, 10)}
                </p>
              </article>
            </a>
          </section>

          <div className="cards">
            {remaining.map((item, idx) => (
              <Card
                key={`${item.url}-${idx}`}
                title={item.title}
                description={item.description}
                imgUrl={item.imageUrl}
                publishedAt={item.publishedAt}
                url={item.url}
                author={item.source?.name || "Unknown"}
                source={item.source?.name || "Unknown"}
              />
            ))}
          </div>

          <div className="pagination">
            <button disabled={filters.page <= 1} className="pagination-btn" onClick={handlePrev}>
              Prev
            </button>
            <p className="font-semibold opacity-80">
              {filters.page} of {Math.max(1, Math.ceil(totalResults / filters.pageSize))}
            </p>
            <button className="pagination-btn" disabled={!canGoNext} onClick={handleNext}>
              Next
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default FeedPage;


