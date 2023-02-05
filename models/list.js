"use strict";

const db = require("../db");
const { sqlPartialUpdate } = require("../helpers/sql-partial-update")
const { NotFoundError } = require("../expressError");

/** Related functions for destination_lists. */

class List {

  /** Find all lists by given user_id.
   * Returns [{ username, id, searched_address, arrival_date, departure_date, [items ...] }, ...]
   **/

  static async findAll(user_id) {
    const res = await db.query(
      `SELECT users.username,
              destination_lists.id,
              destination_lists.searched_address,
              destination_lists.arrival_date,
              destination_lists.departure_date,
              list_items.category,
              list_items.item,
              list_items.qty
      FROM lists
      LEFT JOIN users ON users.id = destination_lists.user_id
      RIGHT JOIN list_items ON destination_lists.id = lists_items.list_id
      WHERE users.id = $1
      ORDER BY destination_lists.arrival_date`,
      [user_id]
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
      `SELECT users.username,
              destination_lists.id,
              destination_lists.searched_address,
              destination_lists.arrival_date,
              destination_lists.departure_date,
              list_items.category,
              list_item.item,
              list_item.qty
      FROM lists
      LEFT JOIN users ON users.id = destination_lists.user_id
      RIGHT JOIN list_items ON destination_lists.id = list_items.list_id
      WHERE destination_lists.id = $1`,
      [list_id]
    );

    const list = listRes.rows[0];

    if (!list) {
      // throw new NotFoundError(`No list: ${list_id}`)
      console.log(`No list: ${list_id}`)
    };

    return list;
  }

  /** Create list with data.
   *
   * Returns { searched_address, arrival_date, departure_date }
   *    where list_items is { category, item, qty }
   *
   **/

  static async create(data) {
    const res = await db.query(
      `INSERT INTO lists 
      (username, 
        searched_address, 
        arrival_date, 
        departure_date) 
      VALUES ($1, $2, $3, $4)
      RETURNING username, id, searched_address, arrival_date, departure_date`,
      [
        data.username,
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

    const sqlQuery = `UPDATE lists
                      SET ${setCols}
                      WHERE destination_lists.id = ${listIdIdx}
                      RETURNING searched_address, arrival_date, departure_date`;

    const result = await db.query(sqlQuery, [...values, list_id]);
    const updatedList = result.rows[0];

    if (!updatedList) {
      // throw new NotFoundError(`No list found: ${list_id}`)
      console.log(`No list found: ${list_id}`)
    };
  }

  /** Delete given list from database; returns undefined. */
  static async remove(list_id) {
    let result = await db.query(
      `DELETE
      FROM lists
      WHERE destination_lists.id = $1
      RETURNING destination_lists.id`,
      [list_id]
    );
    const list = result.rows[0]

    if (!list) {
      // throw new NotFoundError(`No list found: ${list_id}`)
      console.log(`No list found: ${list_id}`)
    };
  }
}

module.exports = List
