const { createNewsApiProvider } = require("../../providers/newsapi");

describe("newsapi provider", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    delete global.fetch;
  });

  it("maps params and normalizes articles", async () => {
    fetch.mockResolvedValue({
      ok: true,
      text: async () =>
        JSON.stringify({
          totalResults: 1,
          articles: [
            {
              title: "A",
              description: "B",
              content: "C",
              url: "https://example.com/a",
              urlToImage: "https://example.com/a.jpg",
              publishedAt: "2026-02-18T00:00:00Z",
              source: { name: "Reuters", url: "https://reuters.com" },
            },
          ],
        }),
    });

    const provider = createNewsApiProvider({ newsApiKey: "key", providerTimeoutMs: 5000 });
    const data = await provider.fetchArticles({ query: "ai", page: 1, pageSize: 10, sortBy: "publishedAt" });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toContain("/everything?");
    expect(fetch.mock.calls[0][0]).toContain("q=ai");
    expect(data.articles[0]).toHaveProperty("imageUrl");
  });
});
