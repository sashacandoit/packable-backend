const { checkDate } = require("./date-check");

describe("checkDate", function () {
  test("works: date more than 15 days", function () {
    let arrival_date = "2023-05-01T04:00:00.000Z"
    let departure_date = "2023-05-03T04:00:00.000Z"
    const result = checkDate(arrival_date, departure_date);
    expect(result).toEqual({
      arrival_date: "2022-05-01",
      departure_date: "2022-05-03"
    });
  });

})