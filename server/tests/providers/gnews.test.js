const { createGNewsProvider } = require("../../providers/gnews");

describe("gnews provider", () => {
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
          totalArticles: 1,
          articles: [
            {
              title: "A",
              description: "B",
              content: "C",
              url: "https://example.com/a",
              image: "https://example.com/a.jpg",
              publishedAt: "2026-02-18T00:00:00Z",
              source: { name: "Reuters", url: "https://reuters.com" },
            },
          ],
        }),
    });

    const provider = createGNewsProvider({ gnewsApiKey: "key", providerTimeoutMs: 5000 });
    const data = await provider.fetchArticles({ query: "ai", page: 1, pageSize: 10, sortBy: "relevance" });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toContain("/search?");
    expect(fetch.mock.calls[0][0]).toContain("q=ai");
    expect(fetch.mock.calls[0][0]).toContain("sortby=relevance");
    expect(data.articles[0]).toHaveProperty("imageUrl");
  });
});
