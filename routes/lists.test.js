"use strict";

const request = require("supertest");

const { NotFoundError, BadRequestError } = require("../expressError");
const db = require("../db.js");
const app = require("../app");
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

/************************************** GET /lists */

describe("GET /lists", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .get(`/lists`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      lists: [
        {
          id: testListIds[0],
          username: "u1",
          searched_address: "new york ny",
          arrival_date: "2023-05-01T04:00:00.000Z",
          departure_date: "2023-05-03T04:00:00.000Z"
        },
        {
          id: testListIds[1],
          username: "u1",
          searched_address: "paris france",
          arrival_date: "2023-05-01T04:00:00.000Z",
          departure_date: "2023-05-03T04:00:00.000Z"
        },
        {
          id: testListIds[2],
          username: "u2",
          searched_address: "mexico city",
          arrival_date: "2023-05-01T04:00:00.000Z",
          departure_date: "2023-05-03T04:00:00.000Z"
        },
      ],
    });
  });

  test("unauth for non-admin users", async function () {
    const resp = await request(app)
      .get("/lists")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .get("/lists");
    expect(resp.statusCode).toEqual(401);
  });
})