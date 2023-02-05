"use strict";

const db = require("../db.js");
const User = require("../models/user");
const List = require("../models/list");
const { createToken } = require("../middleware/tokens");


async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM lists");
  
  await User.register({
    username: "u1",
    firstName: "U1First",
    lastName: "U1Last",
    email: "user1@user.com",
    password: "password1",
  });
  await User.register({
    username: "u2",
    firstName: "U2First",
    lastName: "U2Last",
    email: "user2@user.com",
    password: "password2",
  });
  await User.register({
    username: "u3",
    firstName: "U3First",
    lastName: "U3Last",
    email: "user3@user.com",
    password: "password3",
  });

  testListIds[0] = (await List.create(
    { username: "u1", searched_address: "new york ny", arrival_date: "2023-05-01", departure_date: "2023-05-03" })).id;
  testListIds[1] = (await List.create(
    { username: "u1", searched_address: "paris france", arrival_date: "2023-05-01", departure_date: "2023-05-03" })).id;
  testListIds[2] = (await List.create(
    { username: "u1", searched_address: "mexico city", arrival_date: "2023-05-01", departure_date: "2023-05-03" })).id;

}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


const u1Token = createToken({ username: "u1" });
const u2Token = createToken({ username: "u2" });
const u3Token = createToken({ username: "u3" });


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds,
  u1Token,
  u2Token,
  u3Token,
};
