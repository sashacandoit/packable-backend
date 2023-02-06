const { NotFoundError, BadRequestError } = require("../expressError");
const db = require("../db.js");
const ListItem = require("./list_item.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testListIds
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