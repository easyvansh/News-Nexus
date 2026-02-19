const createMetricsStore = () => {
  const metrics = {
    requests: 0,
    cacheHits: 0,
    cacheMisses: 0,
    providerErrors: 0,
  };

  const increment = (key) => {
    metrics[key] = (metrics[key] || 0) + 1;
  };

  const snapshot = () => {
    const cacheTotal = metrics.cacheHits + metrics.cacheMisses;
    const cacheHitRate = cacheTotal > 0 ? metrics.cacheHits / cacheTotal : 0;
    const providerErrorRate = metrics.requests > 0 ? metrics.providerErrors / metrics.requests : 0;
    return {
      ...metrics,
      cacheHitRate,
      providerErrorRate,
    };
  };

  return { increment, snapshot };
};

module.exports = { createMetricsStore };
