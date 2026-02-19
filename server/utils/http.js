const { AppError } = require("./errors");

const requestJson = async (url, { headers = {}, timeoutMs = 5000 } = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
      signal: controller.signal,
    });

    const text = await response.text();
    let payload = {};
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch (_error) {
        payload = { message: text };
      }
    }

    if (!response.ok) {
      throw new AppError("PROVIDER_ERROR", "Provider request failed", 502, {
        status: response.status,
        payload,
      });
    }

    return payload;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new AppError("PROVIDER_TIMEOUT", "Provider request timed out", 504, { timeoutMs });
    }
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("PROVIDER_ERROR", error.message || "Provider request failed", 502);
  } finally {
    clearTimeout(timeout);
  }
};

module.exports = { requestJson };
