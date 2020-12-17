const express = require("express");
const jsonServer = require("json-server");
const history = require("connect-history-api-fallback");

const app = express();
const router = jsonServer.router("data.json");
const port = process.argv[3] || 4003;

app.use(history());
app.use("/", express.static("dist"));
app.use(jsonServer.bodyParser);
app.use("/api", (req, resp, next) => router(req, resp, next));

app.listen(port, () => console.log(`Running on port ${port}`));