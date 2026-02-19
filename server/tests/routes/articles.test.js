const request = require("supertest");

const mockProvider = {
  name: "gnews",
  fetchArticles: jest.fn(),
  fetchHeadlines: jest.fn(),
  healthCheck: jest.fn(),
};

jest.mock("../../providers", () => ({
  createProvider: () => mockProvider,
}));

describe("articles route", () => {
  let app;

  beforeEach(() => {
    jest.resetModules();
    process.env.GNEWS_API_KEY = "x";
    app = require("../../app");
    mockProvider.fetchArticles.mockResolvedValue({ totalResults: 1, articles: [] });
  });

  it("returns missing param error", async () => {
    const res = await request(app).get("/api/v1/articles");
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("MISSING_PARAM");
  });

  it("returns invalid pagination", async () => {
    const res = await request(app).get("/api/v1/articles?query=test&page=0");
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("INVALID_PAGINATION");
  });
});
