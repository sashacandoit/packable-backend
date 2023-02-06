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
  u1Token,
  u3Token,
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
        },
        {
          username: "u3",
          first_name: "U3First",
          last_name: "U3Last",
          email: "user3@user.com",
          is_admin: false,
        }
      ],
    });
  });

  test("unauth for non-admin users", async function () {
    const resp = await request(app)
      .get("/users")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .get("/users");
    expect(resp.statusCode).toEqual(401);
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

  test("works for admins: create admin", async function () {
    const resp = await request(app)
      .post("/users")
      .send({
        username: "newuser",
        first_name: "First-new",
        last_name: "Last-new",
        password: "password-new",
        email: "new@email.com",
        is_admin: true,
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      user: {
        username: "newuser",
        first_name: "First-new",
        last_name: "Last-new",
        email: "new@email.com",
        is_admin: true,
      }, token: expect.any(String),
    });
  });

  test("unauth for non-admin users", async function () {
    const resp = await request(app)
      .post("/users")
      .send({
        username: "newuser",
        first_name: "First-new",
        last_name: "Last-new",
        password: "password-new",
        email: "new@email.com",
        is_admin: true,
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .post("/users")
      .send({
        username: "newuser",
        first_name: "First-new",
        last_name: "Last-new",
        password: "password-new",
        email: "new@email.com",
        is_admin: true,
      });
    expect(resp.statusCode).toEqual(401);
  });

  //Add after adding json schema validation

  // test("bad request if missing data", async function () {
  //   const resp = await request(app)
  //     .post("/users")
  //     .send({
  //       username: "newuser",
  //     })
  //     .set("authorization", `Bearer ${adminToken}`);
  //   expect(resp.statusCode).toEqual(400);
  // });

  // test("bad request if invalid data", async function () {
  //   const resp = await request(app)
  //     .post("/users")
  //     .send({
  //       username: "newuser",
  //       first_name: "First-new",
  //       last_name: "Last-new",
  //       password: "password-new",
  //       email: "not-an-email",
  //       is_admin: true,
  //     })
  //     .set("authorization", `Bearer ${adminToken}`);
  //   expect(resp.statusCode).toEqual(400);
  // });
})


/************************************** GET /users/:username */

describe("GET /users/:username", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .get(`/users/u1`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      user: {
        username: "u1",
        first_name: "U1First",
        last_name: "U1Last",
        email: "user1@user.com",
        is_admin: false,
        lists:
          [{
            id: expect.any(Number),
            searched_address: "new york ny",
            arrival_date: "2023-05-01T04:00:00.000Z",
            departure_date: "2023-05-03T04:00:00.000Z"
          },
          {
            id: expect.any(Number),
            searched_address: "paris france",
            arrival_date: "2023-05-01T04:00:00.000Z",
            departure_date: "2023-05-03T04:00:00.000Z"
          }]
      },
    });
  });

  test("works for same user", async function () {
    const resp = await request(app)
      .get(`/users/u1`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      user: {
        username: "u1",
        first_name: "U1First",
        last_name: "U1Last",
        email: "user1@user.com",
        is_admin: false,
        lists:
          [{
            id: expect.any(Number),
            searched_address: "new york ny",
            arrival_date: "2023-05-01T04:00:00.000Z",
            departure_date: "2023-05-03T04:00:00.000Z"
          },
          {
            id: expect.any(Number),
            searched_address: "paris france",
            arrival_date: "2023-05-01T04:00:00.000Z",
            departure_date: "2023-05-03T04:00:00.000Z"
          }],
      },
    });
  });

  test("unauth for other users", async function () {
    const resp = await request(app)
      .get(`/users/u1`)
      .set("authorization", `Bearer ${u3Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .get(`/users/u1`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if user not found", async function () {
    const resp = await request(app)
      .get(`/users/nope`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });

})