"use strict";

/** Express app for Capston 2 project. */
const express = require('express');
const cors = require('cors');
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const listsRoutes = require("./routes/lists");
const listItemsRoutes = require("./routes/list_items");

const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");

const app = express();

app.use(cors({
  origin: "http://localhost:3000"
}))
 
app.use(express.json());
app.use(authenticateJWT);

app.get('/cors', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  return res.send({ "msg": "This has CORS enabled 🎈" });
})

app.get('/', function (req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  console.log('Server is working')
  return res.send({ "msg": "This has CORS enabled" });
});

/** tells routes what to prefix with */
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