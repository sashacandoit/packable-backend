"use strict";

const express = require("express");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const router = express.Router();
const { ensureCorrectUser, ensureAdmin } = require("../middleware/auth");

/** Routes for users.
 * Still to do:
 * add jSON schema validator
 */


/** GET / => { users: [ {username, first_name, last_name, email }, ... ] }
 *
 * Returns list of all users.
 *
 **/

router.get("/", ensureAdmin, async function (req, res, next) {
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

router.get("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const user = await User.get(req.params.username);
    return res.json({user})
  } catch (err) {
    return next(err)
  }
})


/** POST / { user }  => { user, token }
 *
 * Adds a new user. This is not the registration endpoint --- instead, this is only for admin users to add new users. 
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, first_name, last_name, email }, token }
 *
 **/

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    // const validator = jsonschema.validate(req.body, userNewSchema);

    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({user, token})
  } catch (err) {
    return next(err)
  }
})


/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { first_name, last_name, password, email }
 *
 * Returns { username, first_name, last_name, email }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.patch("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    // const validator = jsonschema.validate(req.body, userNewSchema);

    const user = await User.update(req.params.username, req.body)
    return res.json({ user });
  } catch (err) {
    return next(err)
  }
})


/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.delete("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    await User.remove(req.params.username)
    return res.json({ deleted: req.params.username });
  } catch (err) {
    return next(err)
  }
})

module.exports = router;
