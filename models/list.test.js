"use strict";

const { NotFoundError, BadRequestError } = require("../expressError");
const db = require("../db.js");
const List = require("./list.js");
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
    let lists = await List.findAll();
    expect(lists).toEqual([
      {
        id: expect.any(Number),
        username: "u1",
        searched_address: 'new york ny',
        arrival_date: expect.any(Date),
        departure_date: expect.any(Date),
      },
      {
        id: expect.any(Number),
        username: "u2",
        searched_address: 'paris france',
        arrival_date: expect.any(Date),
        departure_date: expect.any(Date),
      },
      {
        id: expect.any(Number),
        username: "u2",
        searched_address: 'mexico city',
        arrival_date: expect.any(Date),
        departure_date: expect.any(Date),
      },
    ]);
  });
});


/************************************** create */
describe("create", function () {
  let newList = {
    username: "u1",
    searched_address: "washington dc",
    arrival_date: "2023-05-01",
    departure_date: "2023-05-03"
  };

  test("works", async function () {
    let list = await List.create(newList);
    expect(list).toEqual({
      username: "u1",
      searched_address: "washington dc",
      arrival_date: expect.any(Date),
      departure_date: expect.any(Date),
      id: expect.any(Number),
    });
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let list = await List.get(testListIds[0]);
    expect(list).toEqual({
      id: testListIds[0],
      username: "u1",
      searched_address: "new york ny",
      arrival_date: expect.any(Date),
      departure_date: expect.any(Date),
      list_items: [],
    });
  });

  test("not found if no such list", async function () {
    try {
      await List.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


/************************************** update */

describe("update", function () {
  let updateData = {
    searched_address: "washington dc",
    arrival_date: "06-01-2023",
    departure_date: "06-03-2023"
  };
  test("works", async function () {
    let list = await List.update(testListIds[0], updateData);
    expect(list).toEqual({
      id: testListIds[0],
      username: "u1",
      searched_address: "washington dc",
      arrival_date: expect.any(Date),
      departure_date: expect.any(Date)
    });
  });

  test("works with partial update", async function () {
    let list = await List.update(testListIds[0], {
      searched_address: "miami fl"
    });
    expect(list).toEqual({
      id: testListIds[0],
      username: "u1",
      searched_address: "miami fl",
      arrival_date: expect.any(Date),
      departure_date: expect.any(Date)
    });
  });

  test("not found if no such list", async function () {
    try {
      await List.update(0, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
