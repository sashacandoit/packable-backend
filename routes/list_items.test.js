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

describe("GET /list_items", function () {
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

/************************************** POST /lists */

describe("POST /list_item", function () {
  test("works", async function () {
    const resp = await request(app)
      .post(`/items`)
      .send({
        list_id: testListIds[0],
        category: "Clothing",
        item: "swimsuit",
        qty: 1
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      listItem: {
        id: expect.any(Number),
        list_id: testListIds[0],
        category: "Clothing",
        item: "swimsuit",
        qty: 1
      },
    });
  });

  test("unauth anon", async function () {
    const resp = await request(app)
      .post("/items")
      .send({
        list_id: testListIds[0],
        category: "Clothing",
        item: "swimsuit",
        qty: 1
      })
    expect(resp.statusCode).toEqual(401);
  });
})