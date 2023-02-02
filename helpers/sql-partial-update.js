/** Helper to update table in db 
 * 
 * Accepts partial date from form submittion.
 * Breaks down data into Column Names to be updated and Data for each Column.
 * Returns correct sql syntax for making request
 * 
*/

const sqlPartialUpdate = (dataToUpdate, jsToSql) => {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) {
    //throw new BadRequestError("No Data")
    console.log("No Data")
  }
  const cols = keys.map((colName, idx) =>
    `"${jsToSql[colName] || colName}" = $${idx + 1}`
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate)
  };
}

module.exports = { sqlPartialUpdate };