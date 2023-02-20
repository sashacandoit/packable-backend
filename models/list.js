"use strict";

const db = require("../db");
const { sqlPartialUpdate } = require("../helpers/sql-partial-update")
const { NotFoundError } = require("../expressError");

/** Related functions for destination_lists. */

class List {

  /** Find all lists by given user_id.
   * Returns [{ username, id, searched_address, arrival_date, departure_date, [items ...] }, ...]
   **/

  static async findAll() {
    const res = await db.query(
      `SELECT username,
              id,
              searched_address,
              TO_CHAR(arrival_date, 'YYYY-MM-DD') AS arrival_date,
              TO_CHAR(departure_date, 'YYYY-MM-DD') AS departure_date
      FROM destination_lists
      ORDER BY arrival_date`
    );
    const lists = res.rows;

    if (!lists) {
      console.log('No Lists Created For User Yet')
    };

    return lists;
  }

  /** Given a list id, return data about list and associated items.
   *
   * Returns { username, id, searched_address, arrival_date, departure_date, [items ...] }
   *
   * Throws NotFoundError if not found.
   **/
  static async get(list_id) {
    const listRes = await db.query(
      `SELECT username,
              id,
              searched_address,
              TO_CHAR(arrival_date, 'YYYY-MM-DD') AS arrival_date,
              TO_CHAR(departure_date, 'YYYY-MM-DD') AS departure_date
      FROM destination_lists
      WHERE destination_lists.id = $1`,
      [list_id]
    );

    const list = listRes.rows[0];

    if (!list) {
      console.log(`No list: ${list_id}`)
      throw new NotFoundError(`No list: ${list_id}`)
    };

    const listItemsRes = await db.query(
      `SELECT list_items.category,
              list_items.item,
              list_items.qty,
              list_items.id
        FROM list_items
        WHERE list_id=$1`,
      [list_id]
    )

    list.list_items = listItemsRes.rows;
    return list;
  }

  /** Create list with data.
   *
   * Returns { searched_address, arrival_date, departure_date }
   *    where list_items is { category, item, qty }
   *
   **/

  static async create(data, username) {
    const res = await db.query(
      `INSERT INTO destination_lists 
      (username, 
        searched_address, 
        arrival_date, 
        departure_date) 
      VALUES ($1, $2, $3, $4)
      RETURNING username,
                id,
                searched_address,
                TO_CHAR(arrival_date, 'YYYY-MM-DD') AS arrival_date,
                TO_CHAR(departure_date, 'YYYY-MM-DD') AS departure_date`,
      [
        username,
        data.searched_address,
        data.arrival_date,
        data.departure_date
      ]);
    let list = res.rows[0];
    return list;
  }



  /** Update list with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, password, email, isAdmin }
   *
   * Returns: { searched_address, arrival_date, departure_date }
   *
   * Throws NotFoundError if not found.
   */
  static async update(list_id, data) {
    //convert submitted data to useable syntax for request
    const { setCols, values } = sqlPartialUpdate(
      data,
      {
        searched_address: "searched_address",
        arrival_date: "arrival_date",
        departure_date: "departure_date"
      });

    const listIdIdx = "$" + (values.length + 1);

    const sqlQuery = `UPDATE destination_lists
                      SET ${setCols}
                      WHERE destination_lists.id = ${listIdIdx}
                      RETURNING id,
                                username,
                                searched_address,
                                TO_CHAR(arrival_date, 'YYYY-MM-DD') AS arrival_date,
                                TO_CHAR(departure_date, 'YYYY-MM-DD') AS departure_date`;

    const result = await db.query(sqlQuery, [...values, list_id]);
    const updatedList = result.rows[0];

    if (!updatedList) {
      console.log(`No list found: ${list_id}`)
      throw new NotFoundError(`No list found: ${list_id}`)
    };

    return updatedList;
  }

  /** Delete given list from database; returns undefined. */
  static async remove(list_id) {
    let result = await db.query(
      `DELETE
      FROM destination_lists
      WHERE destination_lists.id = $1
      RETURNING destination_lists.id`,
      [list_id]
    );
    const list = result.rows[0]

    if (!list) {
      console.log(`No list found: ${list_id}`)
      throw new NotFoundError(`No list found: ${list_id}`)
    };
  }
}

module.exports = List;
