require("express-async-errors");
const CustomError = require("./helpers/CustomError");
const errorHandler = require("./middlewares/errorHandler");

const http = require("http");
const app = require("express")();
const server = http.createServer(app);

const databaseConfig = require("./config/db");
const port = process.env.PORT || 3030;

const middlewares = require("./middlewares");
const routes = require("./routes");

middlewares(app);

app.use("/api", routes());

app.use((req, res, next) => {
  throw new CustomError("Invalid request", 400);
});

app.use(errorHandler);

server.listen(port, () => {
  console.log(`:: server listening on port ${port}`);
  databaseConfig();
});

// pass: "puiedlsnkrdmhaxl"
