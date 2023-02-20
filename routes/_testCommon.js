"use strict";

const db = require("../db.js");
const User = require("../models/user");
const List = require("../models/list");
const ListItem = require("../models/list_item");

const { createToken } = require("../helpers/tokens");

const testListIds = []
const testListItemIds = []

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM destination_lists");
  
  const user1 = await User.register({
    username: "u1",
    first_name: "U1First",
    last_name: "U1Last",
    email: "user1@user.com",
    password: "password1",
    is_admin: false
  });
  const user2 = await User.register({
    username: "u2",
    first_name: "U2First",
    last_name: "U2Last",
    email: "user2@user.com",
    password: "password2",
    is_admin: true
  });
  const user3 = await User.register({
    username: "u3",
    first_name: "U3First",
    last_name: "U3Last",
    email: "user3@user.com",
    password: "password3",
    is_admin: false
  });


  testListIds[0] = (await List.create(
    { searched_address: "new york ny", arrival_date: "2023-05-01", departure_date: "2023-05-03" }, "u1")).id;
  testListIds[1] = (await List.create(
    { searched_address: "paris france", arrival_date: "2023-05-01", departure_date: "2023-05-03" }, "u1")).id;
  testListIds[2] = (await List.create(
    { searched_address: "mexico city", arrival_date: "2023-05-01", departure_date: "2023-05-03" }, "u2")).id;
  
  
  testListItemIds[0] = (await ListItem.create(
    testListIds[0], {
      category: "Accessories",
      item: "sunglasses",
      qty: 1
    })).id;
  testListItemIds[1] = (await ListItem.create(
    testListIds[0], {
      category: "Clothing",
      item: "socks",
      qty: 4
    })).id;
  testListItemIds[2] = (await ListItem.create(
    testListIds[0], {
      category: "Documents",
      item: "passport",
      qty: 1
    })).id;
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


const u1Token = createToken({ username: "u1", is_admin: false });
const u3Token = createToken({ username: "u3", is_admin: false });
const adminToken = createToken({ username: "u2", is_admin: true });


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testListIds,
  testListItemIds,
  u1Token,
  u3Token,
  adminToken,
};
