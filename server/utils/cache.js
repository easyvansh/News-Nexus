const createCacheStore = () => {
  const store = new Map();
  const stats = { hits: 0, misses: 0, sets: 0 };

  const get = (key) => {
    const found = store.get(key);
    if (!found) {
      stats.misses += 1;
      return null;
    }

    if (Date.now() > found.expiresAt) {
      store.delete(key);
      stats.misses += 1;
      return null;
    }

    stats.hits += 1;
    return found.value;
  };

  const set = (key, value, ttlSeconds) => {
    stats.sets += 1;
    store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  };

  return {
    get,
    set,
    stats: () => ({
      ...stats,
      size: store.size,
      hitRate: stats.hits + stats.misses > 0 ? stats.hits / (stats.hits + stats.misses) : 0,
    }),
  };
};

const createCacheKey = (providerName, routeName, params = {}) => {
  const sorted = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== "") {
        acc[key] = params[key];
      }
      return acc;
    }, {});

  return `${providerName}:${routeName}:${JSON.stringify(sorted)}`;
};

module.exports = { createCacheStore, createCacheKey };
