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

describe("health route", () => {
  let app;

  beforeEach(() => {
    jest.resetModules();
    process.env.GNEWS_API_KEY = "x";
    app = require("../../app");
  });

  it("returns health shape", async () => {
    mockProvider.healthCheck.mockResolvedValue(true);
    const res = await request(app).get("/api/v1/health");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("providerReachable", true);
    expect(res.body).toHaveProperty("status", "ok");
  });
});
