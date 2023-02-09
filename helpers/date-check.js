/** Helper to check date data passed forcast API request
 * 
 * if departure_date is within 15 days from current date, return data.
 * If departure_date is farther than 15 days from current date, adjust date to 1 year earlier.
 * return new date to use in API request.
 * 
*/

const formatDate = (date) => {
  let yyyy = date.getFullYear().toString();
  let mm = date.getMonth().toString();
  let dd = date.getDate().toString();

  let mmChars = mm.split('');
  let ddChars = dd.split('');
  let newDate = yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);

  return newDate;
}

const checkDate = (arrival_date, departure_date) => {

  /// Returns the difference (in full days) between the provided date and today.
  let today = new Date();
  departure_date = new Date(departure_date);
  arrival_date = new Date(arrival_date);
  const diffTime = Math.abs(departure_date - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  console.log(diffTime + " milliseconds");
  console.log(diffDays + " days");

  //returns adjusted date if difference in days is more than 15
  if (diffDays > 15) {
    arrival_date.setFullYear(arrival_date.getFullYear() - 1);
    departure_date.setFullYear(departure_date.getFullYear() - 1);

    return {
      arrival_date: formatDate(arrival_date),
      departure_date: formatDate(departure_date)
    }
  }
  
  return {
    arrival_date: formatDate(arrival_date),
    departure_date: formatDate(departure_date)
  }
}

module.exports = { checkDate };