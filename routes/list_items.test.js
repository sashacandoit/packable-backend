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
  adminToken,
  u3Token
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** GET /list_items */

describe("GET /lists", function () {
  test("works", async function () {
    const resp = await request(app)
      .get(`/items`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      listItems: [
        {
          id: expect.any(Number),
          list_id: testListIds[0],
          category: "Accessories",
          item: "sunglasses",
          qty: 1
        },
        {
          id: expect.any(Number),
          list_id: testListIds[0],
          category: "Clothing",
          item: "socks",
          qty: 4
        },
        {
          id: expect.any(Number),
          list_id: testListIds[0],
          category: "Documents",
          item: "passport",
          qty: 1
        },
      ],
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .get("/lists");
    expect(resp.statusCode).toEqual(401);
  });
})