const express = require("express");
const ListItem = require("../models/list_item");

const router = express.Router();
const { ensureCorrectUser, ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");

/** Routes for list Items.
 * Still to do:
 * add jSON schema validator
 */

/** GET / =>
 *   { list_items: [ { id, list_id, category, item, qty }, ...] }
 * 
 * Authorization required: must be logged in
 */

router.get("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const listItems = await ListItem.findAll();
    return res.json({ listItems });
  } catch (err) {
    return next(err)
  }
})

/** GET /[list_item_id] => { list_item }
 *
 * Returns { id, list_id, searched_address, arrival_date, departure_date, category, item, qty }
 *
 * Authorization required: only lists by current user or admin can be accessed
 */

router.get("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const listItem = await ListItem.get(req.params.id)
    return res.json({ listItem });
  } catch (err) {
    return next(err);
  }
});

/** POST / { list_item } => { list_item }
 *
 * list_item should be { category, item, qty }
 * 
 * Returns { id, list_id, category, item, qty }
 *
 * Authorization required: logged in
 */

router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
     // const validator = jsonschema.validate(req.body, createListItemSchema);
    const listItem = await ListItem.create(req.body)
    console.log(listItem)
    return res.status(201).json({ listItem });
  } catch (err) {
    return next(err)
  }
})

/** PATCH /[list_item_id]  { fld1, fld2, ... } => { list_item }
 *
 * Data can include: { category, item, qty }
 *
 * Returns { id, list_id, category, item, qty }
 *
 * Authorization required: logged in
 */

router.patch("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    // const validator = jsonschema.validate(req.body, updateListItemSchema);

    const listItem = await ListItem.update(req.params.id, req.body)
    return res.json({ listItem });
  } catch (err) {
    return next(err)
  }
})

/** DELETE /[list_item_id]  =>  { deleted: list_item_id }
*
* Authorization required: logged in
**/

router.delete("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    await ListItem.remove(req.params.id)
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err)
  }
})


module.exports = router;
