"use strict";

/** Express app for Capston 2 project. */
const express = require('express');
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const listsRoutes = require("./routes/lists");
const listItemsRoutes = require("./routes/list_items");

const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");

const app = express();

app.use(express.json());
app.use(authenticateJWT);

app.get('/', function (req, res) {
  console.log('Server is working')
  return res.send('<h1>My server does something</h1>'); 
});

/** tells routes what to prefix with -- not set up yet */
// app.use("/users", usersRoutes);
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/lists", listsRoutes);
app.use("/items", listItemsRoutes);


/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;