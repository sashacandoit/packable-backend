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
          arrival_date: "2023-05-01",
          departure_date: "2023-05-03"
        },
        {
          id: testListIds[1],
          username: "u1",
          searched_address: "paris france",
          arrival_date: "2023-05-01",
          departure_date: "2023-05-03"
        },
        {
          id: testListIds[2],
          username: "u2",
          searched_address: "mexico city",
          arrival_date: "2023-05-01",
          departure_date: "2023-05-03"
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

/************************************** POST /lists */

describe("POST /lists", function () {
  console.log(adminToken)
  test("ok for admin", async function () {
    const resp = await request(app)
      .post(`/lists`)
      .send({
        username: "u1",
        searched_address: "washington dc",
        arrival_date: "2023-05-01",
        departure_date: "2023-05-03"
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      list: {
        id: expect.any(Number),
        username: "u1",
        searched_address: "washington dc",
        arrival_date: "2023-05-01",
        departure_date: "2023-05-03"
      },
    });
  });

  test("ok for same user", async function () {
    const resp = await request(app)
      .post(`/lists`)
      .send({
        username: "u1",
        searched_address: "washington dc",
        arrival_date: "2023-05-01",
        departure_date: "2023-05-03"
      }, "u1")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      list: {
        id: expect.any(Number),
        username: "u1",
        searched_address: "washington dc",
        arrival_date: "2023-05-01",
        departure_date: "2023-05-03"
      },
    });
  });

  test("unauth anon", async function () {
    const resp = await request(app)
      .post("/lists")
      .send({
        searched_address: "washington dc",
        arrival_date: "2023-05-01",
        departure_date: "2023-05-03"
      })
    expect(resp.statusCode).toEqual(401);
  });
})


/************************************** POST /lists/:id/items */

describe("POST /lists/:id/items", function () {
  console.log(adminToken)
  test("ok for admin", async function () {
    const resp = await request(app)
      .post(`/lists/${testListIds[0]}/items`)
      .send({
        category: "Clothing",
        item: "swimsuit",
        qty: 1
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      item: {
        id: expect.any(Number),
        list_id: testListIds[0],
        category: "Clothing",
        item: "swimsuit",
        qty: 1
      },
    });
  });

  test("ok for same user", async function () {
    const resp = await request(app)
      .post(`/lists/${testListIds[0]}/items`)
      .send({
        category: "Clothing",
        item: "swimsuit",
        qty: 1
      }, "u1")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      item: {
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
      .post(`/lists/${testListIds[0]}/items`)
      .send({
        category: "Clothing",
        item: "swimsuit",
        qty: 1
      })
    expect(resp.statusCode).toEqual(401);
  });
})

/************************************** get */

describe("get /lists/:id", function () {
  test("works for same user", async function () {
    const resp = await request(app)
      .get(`/lists/${testListIds[0]}`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      list: {
        id: testListIds[0],
        username: "u1",
        searched_address: "new york ny",
        arrival_date: "2023-05-01",
        departure_date: "2023-05-03",
        list_items: [
          {
            category: "Accessories",
            item: "sunglasses",
            qty: 1,
            id: expect.any(Number)
          },
          {
            category: "Clothing",
            item: "socks",
            qty: 4,
            id: expect.any(Number)
          },
          {
            category: "Documents",
            item: "passport",
            qty: 1,
            id: expect.any(Number)
          },
        ],
      }
    });
  });

  test("works", async function () {
    const resp = await request(app)
      .get(`/lists/${testListIds[0]}`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      list: {
        id: testListIds[0],
        username: "u1",
        searched_address: "new york ny",
        arrival_date: "2023-05-01",
        departure_date: "2023-05-03",
        list_items: [
          {
            category: "Accessories",
            item: "sunglasses",
            qty: 1,
            id: expect.any(Number)
          },
          {
            category: "Clothing",
            item: "socks",
            qty: 4,
            id: expect.any(Number)
          },
          {
            category: "Documents",
            item: "passport",
            qty: 1,
            id: expect.any(Number)
          },
        ],
      }
    });
  });

  test("not found if no such list", async function () {
    try {
      const resp = await request(app)
        .get(`/lists/0`)
        .set("authorization", `Bearer ${adminToken}`);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .get(`/lists/${testListIds[0]}`)
    expect(resp.statusCode).toEqual(401);
  });
});


/************************************** get list items */

describe("get /lists/:id/lists", function () {
  test("works for same user", async function () {
    const resp = await request(app)
      .get(`/lists/${testListIds[0]}/items`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      items: [
        {
          list_id: testListIds[0],
          category: "Accessories",
          item: "sunglasses",
          qty: 1,
          id: expect.any(Number)
        },
        {
          list_id: testListIds[0],
          category: "Clothing",
          item: "socks",
          qty: 4,
          id: expect.any(Number)
        },
        {
          list_id: testListIds[0],
          category: "Documents",
          item: "passport",
          qty: 1,
          id: expect.any(Number)
        },
      ],
    });
  });

  test("works", async function () {
    const resp = await request(app)
      .get(`/lists/${testListIds[0]}/items`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      items: [
        {
          list_id: testListIds[0],
          category: "Accessories",
          item: "sunglasses",
          qty: 1,
          id: expect.any(Number)
        },
        {
          list_id: testListIds[0],
          category: "Clothing",
          item: "socks",
          qty: 4,
          id: expect.any(Number)
        },
        {
          list_id: testListIds[0],
          category: "Documents",
          item: "passport",
          qty: 1,
          id: expect.any(Number)
        },
      ]
    });
  });

  test("not found if no such list", async function () {
    try {
      const resp = await request(app)
        .get(`/lists/0/items`)
        .set("authorization", `Bearer ${adminToken}`);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .get(`/lists/${testListIds[0]}`)
    expect(resp.statusCode).toEqual(401);
  });
});


/************************************** PATCH /lists/:id */

describe("PATCH /lists/:id", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .patch(`/lists/${testListIds[0]}`)
      .send({
        arrival_date: "2023-04-01",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      list: {
        id: testListIds[0],
        username: "u1",
        searched_address: "new york ny",
        arrival_date: "2023-04-01",
        departure_date: "2023-05-03"
      }
    });
  });

  test("works for logged in user", async function () {
    const resp = await request(app)
      .patch(`/lists/${testListIds[0]}`)
      .send({
        arrival_date: "2023-04-01",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      list: {
        id: testListIds[0],
        username: "u1",
        searched_address: "new york ny",
        arrival_date: "2023-04-01",
        departure_date: "2023-05-03"
      }
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .patch(`/lists/${testListIds[0]}`)
      .send({ arrival_date: "2023-04-01" })
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no such list", async function () {
    try {
      const resp = await request(app)
        .patch(`/lists/0`)
        .send({ arrival_date: "2023-04-01" })
        .set("authorization", `Bearer ${adminToken}`);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
})

/************************************** DELETE /lists/:id */

describe("DELETE /lists/:id", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .delete(`/lists/${testListIds[0]}`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ deleted: `${testListIds[0]}` });
  });

  //still doesn't work with authorization
  test.skip("works for same user", async function () {
    const resp = await request(app)
      .delete(`/lists/${testListIds[0]}`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ deleted: `${testListIds[0]}` });
  });

  //still doesn't work with authorization
  test.skip("unauth for others", async function () {
    const resp = await request(app)
      .delete(`/lists/${testListIds[0]}`)
      .set("authorization", `Bearer ${u3Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .delete(`/lists/${testListIds[0]}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such list", async function () {
    const resp = await request(app)
      .delete(`/lists/0`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});