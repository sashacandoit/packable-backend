"use strict";

const express = require("express");
const List = require("../models/user");
const router = express.Router();
const { BadRequestError } = require("../expressError");

/** Routes for lists.
 * Still to do:
 * add isAdmin
 * add jSON schema validator
 */

/** GET / =>
 *   { lists: [ { username, id, searched_address, arrival_date, departure_date, list_items }, ...] }
 *    where list_items is { category, item, qty }
 * Authorization required: none
 */

// router.get("/", async function (req, res, next) {
//   try {
//     const lists = await List.findAll()
//   } catch (err) {

//   }
// })


/** GET /[list_id] => { list }
 *
 * Returns { username, id, searched_address, arrival_date, departure_date, list_items }
 *   where list_items is { category, item, qty }
 *
 * Authorization required: only lists by current user can be accessed
 */

router.get("/:id", async function (req, res, next) {
  try {
    const list = await List.get(req.params.id)
    return res.json({ list });
  } catch (err) {
    return next(err);
  }
});


/** POST / { list } => { list }
 *
 * list should be { username, searched_address, arrival_date, departure_date, list_items }
 *    where list_items is { category, item, qty }
 * 
 * Returns { username, id, searched_address, arrival_date, departure_date, list_items }
 *
 * Authorization required: current user
 */

router.post("/", async function (req, res, next) {
  try {
    const list = await List.create(req.body)
    return res.status(201).json({ list });
  } catch (err) {
    return next (err)
  }
})


/** PATCH /[list_id]  { fld1, fld2, ... } => { list }
 *
 * Data can include: { searched_address, arrival_date, departure_date }
 *
 * Returns { username, id, searched_address, arrival_date, departure_date, list_items }
 *
 * Authorization required: current user
 */

router.patch("/:id", async function (req, res, next) {
  try {
    // const validator = jsonschema.validate(req.body, updateListSchema);

    const list = await List.update(req.params.id, req.body)
    return res.json({ list });
  } catch (err) {
    return next(err)
  }
})

  /** DELETE /[list_id]  =>  { deleted: list_id }
 *
 * Authorization required: current user
 **/

router.delete("/:id", async function (req, res, next) {
  try {
    await List.remove(req.params.id)
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err)
  }
})

module.exports = router;

