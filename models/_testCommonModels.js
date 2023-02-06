const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

const testListIds = [];

async function commonBeforeAll() {
  await db.query("DELETE FROM destination_lists");
  await db.query("DELETE FROM users");

  await db.query(`
        INSERT INTO users (username,
                          password,
                          first_name,
                          last_name,
                          email)
        VALUES ('u1', $1, 'U1First', 'U1Last', 'u1@email.com'),
               ('u2', $2, 'U2First', 'U2Last', 'u2@email.com')
        RETURNING username`,
    [
      await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
    ]);
  
  const listResults = await db.query(`
    INSERT INTO destination_lists (username, 
                      searched_address, 
                      arrival_date, 
                      departure_date)
    VALUES ('u1', 'new york ny', '2023-05-01', '2023-05-03'),
           ('u2', 'paris france', '2023-05-01', '2023-05-03'),
           ('u2', 'mexico city', '2023-05-01', '2023-05-03')
    RETURNING id`);
  
  testListIds.splice(0, 0, ...listResults.rows.map(r => r.id));

  const listItems = await db.query(`
    INSERT INTO list_items (
              list_id,
              category,
              item,
              qty
              )
    VALUES ($1, 'Clothing', 'socks', 5),
           ($1, 'Footware', 'dress shoes', 1),
           ($1, 'Accessories', 'sunglasses', 1),
           ($1, 'Clothing', 'pajamas', 2)
    RETURNING id`,
    [testListIds[0]]
  );
}



async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testListIds
};