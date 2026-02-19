const { createGNewsProvider } = require("./gnews");
const { createNewsApiProvider } = require("./newsapi");

const createProvider = (providerName, config) => {
  if (providerName === "newsapi") {
    return createNewsApiProvider(config);
  }
  return createGNewsProvider(config);
};

module.exports = { createProvider };
