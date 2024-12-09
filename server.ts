#!/usr/bin/env node

const path = require("path");
const { createRequestHandler } = require("@expo/server/adapter/express");

const express = require("express");
const compression = require("compression");
const morgan = require("morgan");

const CLIENT_BUILD_DIR = path.join(process.cwd(), "build/client");
const SERVER_BUILD_DIR = path.join(process.cwd(), "build/server");

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

process.env.EXPO_PUBLIC_ESSENCE_REST_API_URL =
  "https://mkhg9ap0r7.execute-api.us-east-1.amazonaws.com";
process.env.NODE_ENV = "production";

app.use(
  express.static(CLIENT_BUILD_DIR, {
    maxAge: "1h",
    extensions: ["html"],
  }),
);

app.use(morgan("tiny"));

app.all(
  "*",
  createRequestHandler({
    build: SERVER_BUILD_DIR,
  }),
);
const port = process.env.PORT || 80;

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
