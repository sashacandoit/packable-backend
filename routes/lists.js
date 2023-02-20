"use strict";

const express = require("express");
const List = require("../models/list");
const ListItem = require("../models/list_item");

const router = express.Router();
const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const {getForcast} = require("../vc_api")

/** Routes for lists.
 * Still to do:
 * add jSON schema validator
 */

/** GET / =>
 *   { lists: [ { username, id, searched_address, arrival_date, departure_date, list_items }, ...] }
 *    where list_items is { category, item, qty }
 * Authorization required: none
 */

router.get("/", ensureAdmin, async function (req, res, next) {
  try {
    const lists = await List.findAll();
    return res.json({ lists });
  } catch (err) {
    return next(err)
  }
})


/** GET /[list_id] => { list }
 *
 * Returns { username, id, searched_address, arrival_date, departure_date, list_items }
 *   where list_items is { category, item, qty }
 *
 * Authorization required: only lists by current user or admin can be accessed
 */

router.get("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const list = await List.get(req.params.id)
    return res.json({ list });
  } catch (err) {
    return next(err);
  }
});


/** GET /[list_id] / forcast => { list }
 *
 * Returns { list_id, resolvedAddress, days }
 *   where list_items is { category, item, qty }
 *
 * Authorization required: must be logged in
 */

router.get("/:id/forcast", ensureLoggedIn, async function (req, res, next) {
  try {
    const listRes = await List.get(req.params.id)
    const forcast = await getForcast(listRes.arrival_date, listRes.departure_date, listRes.searched_address)
    return res.json({ forcast });
  } catch (err) {
    return next(err);
  }
});

/** GET /[list_id] / list_items => { list_items }
 *
 * Returns list: [{ list_id, category, item, qty },...]
 *
 * Authorization required: must be logged in
 */

router.get("/:id/items", ensureLoggedIn, async function (req, res, next) {
  try {
    const items = await ListItem.findAllForList(req.params.id)
    return res.json({ items });
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

router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const currUser = res.locals.user
    const list = await List.create(req.body, (currUser.is_admin ? req.body.username : currUser.username))

    return res.status(201).json({ list });
  } catch (err) {
    return next (err)
  }
})


router.post("/:id/items", ensureLoggedIn, async function (req, res, next) {
  try {
    const currUser = res.locals.user
    const item = await ListItem.create(req.params.id, req.body, (currUser.is_admin ? req.body.username : currUser.username))

    return res.status(201).json({ item });
  } catch (err) {
    return next(err)
  }
})



router.patch("/:id", ensureLoggedIn, async function (req, res, next) {
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

  //checking for current user in res.locals doesn't work here when called through frontend
router.delete("/:id", async function (req, res, next) {
  try {
    await List.remove(req.params.id)
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err)
  }
})


module.exports = router;

