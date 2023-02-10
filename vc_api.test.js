const { getForcast } = require("./vc_api");

"use strict";

describe("getForcast", function () {
  test("works", function () {
    let address = "new york ny"
    let startDate = "2022-5-1"
    let endDate = "2022-5-3"
    let result = getForcast(startDate, endDate, address)
    expect.any(Object)
  })
})
