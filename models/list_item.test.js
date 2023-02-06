const { NotFoundError } = require("../expressError");
const db = require("../db.js");
const ListItem = require("./list_item.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testListIds,
  testListItemIds
} = require("./_testCommonModels");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let listItems = await ListItem.findAll(testListIds[0]);
    expect(listItems).toEqual([
      {
        id: expect.any(Number),
        list_id: testListIds[0],
        searched_address: "new york ny",
        arrival_date: expect.any(Date),
        departure_date: expect.any(Date),
        category: "Accessories",
        item: "sunglasses",
        qty: 1
      },
      {
        id: expect.any(Number),
        list_id: testListIds[0],
        searched_address: "new york ny",
        arrival_date: expect.any(Date),
        departure_date: expect.any(Date),
        category: "Clothing",
        item: "socks",
        qty: 5
      },
      {
        id: expect.any(Number),
        list_id: testListIds[0],
        searched_address: "new york ny",
        arrival_date: expect.any(Date),
        departure_date: expect.any(Date),
        category: "Clothing",
        item: "pajamas",
        qty: 2
      },
      {
        id: expect.any(Number),
        list_id: testListIds[0],
        searched_address: "new york ny",
        arrival_date: expect.any(Date),
        departure_date: expect.any(Date),
        category: "Footware",
        item: "dress shoes",
        qty: 1
      }
    ]);
  });
});

/************************************** get */
describe("get", function () {
  test("works", async function () {
    let listItem = await ListItem.get(testListItemIds[0]);
    expect(listItem).toEqual({
      id: expect.any(Number),
      list_id: testListIds[0],
      category: "Clothing",
      item: "socks",
      qty: 5
    })
  })
})

/************************************** create */
describe("create", function () {

  test("works", async function () {
    let listItem = await ListItem.create(
      {
        list_id: testListIds[0],
        category: "Documents",
        item: "passport",
        qty: 1
      }
    );
    expect(listItem).toEqual({
      id: expect.any(Number),
      list_id: testListIds[0],
      category: "Documents",
      item: "passport",
      qty: 1
    })
  })
})

/************************************** update */
describe("update", function () {
  let updateData = {
    category: "Clothing",
    item: "swimsuit",
    qty: 2
  }
  test("works", async function () {
    let listItem = await ListItem.update(testListItemIds[0], updateData);
    expect(listItem).toEqual({
      id: testListItemIds[0],
      list_id: expect.any(Number),
      category: "Clothing",
      item: "swimsuit",
      qty: 2
    });
  });

  test("works with partial update", async function () {
    let list = await ListItem.update(testListItemIds[0], {
      qty: 4
    });
    expect(list).toEqual({
      id: testListItemIds[0],
      list_id: expect.any(Number),
      category: "Clothing",
      item: "socks",
      qty: 4
    });
  });

  test("not found if no such list", async function () {
    try {
      await ListItem.update(0, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
})

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await ListItem.remove(testListItemIds[0]);
    const res = await db.query(
      "SELECT id FROM list_items WHERE id=$1", [testListIds[0]]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such list", async function () {
    try {
      await ListItem.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});