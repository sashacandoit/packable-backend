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

/************************************** GET /items */

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


/************************************** GET /items/:id */

describe("get list item", function () {
  test("works", async function () {
    const resp = await request(app)
      .get(`/items/${testListItemIds[0]}`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      listItem: {
        id: expect.any(Number),
        list_id: testListIds[0],
        category: "Accessories",
        item: "sunglasses",
        qty: 1,
        searched_address: "new york ny",
        arrival_date: "2023-05-01T04:00:00.000Z",
        departure_date: "2023-05-03T04:00:00.000Z"
      }
    });
  });

  test("not found if no such item", async function () {
    try {
      const resp = await request(app)
        .get(`/items/0`)
        .set("authorization", `Bearer ${adminToken}`);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .get(`/items/${testListItemIds[0]}`)
    expect(resp.statusCode).toEqual(401);
  });
});



/************************************** PATCH /lists/:id */

describe("PATCH /items/:id", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .patch(`/items/${testListItemIds[0]}`)
      .send({
        qty: 2,
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      listItem: {
        id: testListItemIds[0],
        list_id: testListIds[0],
        category: "Accessories",
        item: "sunglasses",
        qty: 2
      }
    });
  });

  test("works for logged in user", async function () {
    const resp = await request(app)
      .patch(`/items/${testListItemIds[0]}`)
      .send({
        qty: 2,
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      listItem: {
        id: testListItemIds[0],
        list_id: testListIds[0],
        category: "Accessories",
        item: "sunglasses",
        qty: 2
      }
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .patch(`/items/${testListIds[0]}`)
      .send({ qty: 2 })
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no such list", async function () {
    try {
      const resp = await request(app)
        .patch(`/items/0`)
        .send({ qty: 2 })
        .set("authorization", `Bearer ${adminToken}`);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
})


/************************************** DELETE /items/:id */

describe("DELETE /items/:id", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .delete(`/items/${testListItemIds[0]}`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ deleted: `${testListItemIds[0]}` });
  });

  test("works for logged in", async function () {
    const resp = await request(app)
      .delete(`/items/${testListItemIds[0]}`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ deleted: `${testListItemIds[0]}` });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .delete(`/items/${testListItemIds[0]}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such item", async function () {
    const resp = await request(app)
      .delete(`/items/0`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});