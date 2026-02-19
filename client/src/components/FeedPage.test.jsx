import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import FeedPage from "./FeedPage";

vi.mock("../lib/api", () => ({
  fetchArticles: vi.fn(),
  fetchHeadlines: vi.fn(),
}));

import { fetchArticles } from "../lib/api";

const renderFeed = (path = "/?query=tech&page=1&pageSize=10") =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<FeedPage mode="articles" />} />
      </Routes>
    </MemoryRouter>
  );

describe("FeedPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows empty state", async () => {
    fetchArticles.mockResolvedValue({ data: { articles: [], totalResults: 0 } });
    renderFeed();
    await waitFor(() => expect(screen.getByText(/No articles found/i)).toBeInTheDocument());
  });

  it("shows error and retries", async () => {
    fetchArticles.mockRejectedValueOnce(new Error("Failed"));
    fetchArticles.mockResolvedValueOnce({ data: { articles: [], totalResults: 0 } });
    renderFeed();

    await waitFor(() => expect(screen.getByText("Failed")).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /Retry/i }));
    await waitFor(() => expect(fetchArticles).toHaveBeenCalledTimes(2));
  });

  it("disables prev on page 1", async () => {
    fetchArticles.mockResolvedValue({
      data: {
        articles: [
          { title: "A", description: "B", imageUrl: null, publishedAt: "2026-02-18", url: "https://a.com", source: { name: "X" } },
        ],
        totalResults: 1,
      },
    });
    renderFeed();
    await waitFor(() => expect(screen.getByText("A")).toBeInTheDocument());
    expect(screen.getByRole("button", { name: /(Prev|Earlier Edition)/i })).toBeDisabled();
  });

  it("debounces query updates", async () => {
    fetchArticles.mockResolvedValue({ data: { articles: [], totalResults: 0 } });
    renderFeed("/?query=tech&page=1&pageSize=10");
    await waitFor(() => expect(fetchArticles).toHaveBeenCalledTimes(1));
    fetchArticles.mockClear();

    const input = await screen.findByPlaceholderText(/Search/i);
    fireEvent.change(input, { target: { value: "tech a" } });
    fireEvent.change(input, { target: { value: "tech ai" } });

    await new Promise((resolve) => setTimeout(resolve, 350));
    await waitFor(() => expect(fetchArticles).toHaveBeenCalledTimes(1));
  });
});
