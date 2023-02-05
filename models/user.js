"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const {sqlPartialUpdate} = require("../helpers/sql-partial-update")
const { BCRYPT_WORK_FACTOR } = require("../config.js");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

/** Related functions for users. */

class User {
  /** authenticate user with username, password.
 * Returns { username, first_name, last_name, email, is_admin }
 * Throws UnauthorizedError is user not found or wrong password.
 **/

  static async authenticate(username, password) {
    //try to find the user first
    const result = await db.query(
      `SELECT username,
        password,
        first_name,
        last_name,
        email
      FROM users
      WHERE username = $1`,
      [username]
    );
    const user = result.rows[0];

    if (user) {
      //compare hashed password to password to a new hash from password entered
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }
    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   * Returns { username, firstName, lastName, email, isAdmin }
   * Throws BadRequestError on duplicates.
   **/

  static async register({ username, password, email, first_name, last_name }) {

    const duplicateCheck = await db.query(
      `SELECT username
           FROM users
           WHERE username = $1`,
      [username],
    );

    if (duplicateCheck.rows[0]) {
      console.log(`Duplicate username: ${username}`);
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
        (username,
        password, 
        email,
        first_name,
        last_name)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING username, first_name, last_name, email`,
      [username, hashedPassword, email, first_name, last_name],
    );
    const user = result.rows[0];
    return user;
  }

  /** Find all users.
   * Returns [{ username, first_name, last_name, email }, ...]
   **/

  static async findAll() {
    const result = await db.query(
      `SELECT username, email, first_name, last_name
      FROM users
      ORDER BY username`,
    )
    return result.rows;
  }

  /** Given a username, return data about user.
   * Returns { username, email, first_name, last_name }
   * Throws NotFoundError if user not found.
   **/

  static async get(username) {
    const userRes = await db.query(
      `SELECT username, email, first_name, last_name
      FROM users
      WHERE username = $1`,
      [username],
    );
    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    const listRes = await db.query(
      `SELECT id, searched_address, arrival_date, departure_date
      FROM destination_lists
      WHERE username = $1
      ORDER BY arrival_date`,
      [username]
    )
    user.lists = listRes.rows;
    return user;
  }

  /** Update user with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, password, email }
   *
   * Returns: { username, firstName, lastName, email }
   *
   * Throws NotFoundError if not found.
   */

  static async update(username, data) {
    //create a new hashed password if an updated password was provided
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR)
    };

    //convert submitted data to useable syntax for request
    const { setCols, values } = sqlPartialUpdate(
      data,
      {
        email: "email",
        first_name: "first_name",
        last_name: "last_name"
      });
    
    const usernameIdx = "$" + (values.length + 1);

    const sqlQuery = `UPDATE users
                      SET ${setCols}
                      WHERE username = ${usernameIdx}
                      RETURNING username, first_name, last_name, email`;
    
    const result = await db.query(sqlQuery, [...values, username]);
    const updatedUser = result.rows[0];

    if (!updatedUser) throw new NotFoundError(`No user: ${username}`);

    delete updatedUser.password;
    return updatedUser;
  }

  /** Delete given user from database; returns undefined. */
  static async remove(username) {
    let result = await db.query(
      `DELETE
      FROM users
      WHERE username = $1
      RETURNING username`,
      [username]
    );
    const user = result.rows[0]

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }
}

module.exports = User;
