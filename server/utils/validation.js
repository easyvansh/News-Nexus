const { AppError } = require("./errors");

const allowedCategories = new Set([
  "general",
  "world",
  "nation",
  "business",
  "technology",
  "entertainment",
  "sports",
  "science",
  "health",
]);

const parsePositiveInt = (value, fallback) => {
  if (value === undefined || value === null || value === "") return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return parsed;
};

const validatePagination = ({ page, pageSize, maxPageSize = 50, maxWindow = 1000 }) => {
  const resolvedPage = parsePositiveInt(page, 1);
  const resolvedPageSize = parsePositiveInt(pageSize, 10);

  if (resolvedPage < 1 || resolvedPageSize < 1 || resolvedPageSize > maxPageSize) {
    throw new AppError("INVALID_PAGINATION", "Invalid page or pageSize", 400, {
      page: resolvedPage,
      pageSize: resolvedPageSize,
    });
  }

  if (resolvedPage * resolvedPageSize > maxWindow) {
    throw new AppError("INVALID_PAGINATION", "Requested page exceeds provider pagination window", 400, {
      page: resolvedPage,
      pageSize: resolvedPageSize,
      maxWindow,
    });
  }

  return { page: resolvedPage, pageSize: resolvedPageSize };
};

const validateCategory = (value = "general") => {
  if (!allowedCategories.has(value)) {
    throw new AppError("INVALID_CATEGORY", "Invalid category", 400, {
      allowed: Array.from(allowedCategories),
      received: value,
    });
  }
  return value;
};

module.exports = { validatePagination, validateCategory, allowedCategories };
