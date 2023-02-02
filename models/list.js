"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlPartialUpdate } = require("../helpers/sql-partial-update")
const { BCRYPT_WORK_FACTOR } = require("../config.js");
const { NotFoundError } = require("../../../React JS/projects/react-jobly/backend/expressError");

/** Related functions for destination_lists. */

class Lists {

  /** Find all lists by given user_id.
   * Returns [{ username, id, searched_address, arrival_date, departure_date, [items ...] }, ...]
   **/

  static async findAll(user_id) {
    const res = await db.query(
      `SELECT users.username,
              lists.id,
              lists.searched_address,
              lists.arrival_date,
              lists.departure_date,
              list_items.category,
              list_item.item,
              list_item.qty
      FROM lists
      LEFT JOIN users ON users.id = lists.user_id
      RIGHT JOIN list_items ON list.id = lists_items.list_id
      WHERE users.id = $1`,
      [user_id]
    );
    const lists = res.rows;

    if (!lists) {
      console.log('No Lists Created For User Yet')
    };

    return lists;
  }
}
