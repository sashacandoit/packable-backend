"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const User = require("../models/user");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testListIds,
  testListItemIds,
  u1Token,
  adminToken
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** GET /users */

describe("GET /users", function () {
  test("works for admins", async function () {
    const resp = await request(app)
      .get("/users")
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      users: [
        {
          username: "u1",
          first_name: "U1First",
          last_name: "U1Last",
          email: "user1@user.com",
          is_admin: false,
        },
        {
          username: "u2",
          first_name: "U2First",
          last_name: "U2Last",
          email: "user2@user.com",
          is_admin: true,
        }
      ],
    });
  });
})


/************************************** POST /users */

describe("POST /users", function () {
  test("works for admins: create non-admin", async function () {
    const resp = await request(app)
      .post("/users")
      .send({
        username: "u-new",
        first_name: "First-new",
        last_name: "Last-new",
        password: "password-new",
        email: "new@email.com",
        is_admin: false,
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      user: {
        username: "u-new",
        first_name: "First-new",
        last_name: "Last-new",
        email: "new@email.com",
        is_admin: false,
      }, token: expect.any(String),
    });
  });
})