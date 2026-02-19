const app = require("./app");

const port = app.locals.config.port;

app.listen(port, () => {
  console.log(`News Nexus API listening on http://localhost:${port}`);
});
