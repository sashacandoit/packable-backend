"use strict";

const express = require("express");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const router = express.Router();

/** GET / => { users: [ {username, first_name, last_name, email }, ... ] }
 *
 * Returns list of all users.
 *
 **/

router.get("/", async function (req, res, next) {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err)
  }
})


/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, email, lists }
 *   where lists is { id, searched_address, arrival_date, departure_date }
 *
 **/



/** POST / { user }  => { user, token }
 *
 * Adds a new user. This is not the registration endpoint --- instead, this is only for admin users to add new users. 
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, first_name, last_name, email }, token }
 *
 **/


/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { first_name, last_name, password, email }
 *
 * Returns { username, first_name, last_name, email }
 *
 * Authorization required: admin or same-user-as-:username
 **/



/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: admin or same-user-as-:username
 **/


