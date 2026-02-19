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

describe("headlines route", () => {
  let app;

  beforeEach(() => {
    jest.resetModules();
    process.env.GNEWS_API_KEY = "x";
    app = require("../../app");
    mockProvider.fetchHeadlines.mockResolvedValue({ totalResults: 1, articles: [] });
  });

  it("rejects invalid category", async () => {
    const res = await request(app).get("/api/v1/headlines?category=invalid");
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("INVALID_CATEGORY");
  });

  it("returns headlines for valid request", async () => {
    const res = await request(app).get("/api/v1/headlines?category=general");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data.articles");
  });
});
