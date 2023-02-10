const express = require('express');
const app = express();
const axios = require('axios');
require("dotenv").config();
const VC_API_KEY = process.env.VC_API_KEY;
const { BadRequestError } = require("./expressError");

/** Makes request to Visual Crossing using API Key
 * 
 * Accepts user list data to make request
 * Returns: { date: { resolvedAddress, description, searched_address, tempmin, tempmax, temp, conditions, icon }, ...] }
 * 
*/

const BASE_URL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline"
const appendURL = "?unitGroup=us&include=days&contentType=json"

async function getForcast(startDate, endDate, location) {
  try {
    let url = `${BASE_URL}/${location}/${startDate}/${endDate}${appendURL}&key=${VC_API_KEY}`
    let res = await axios.get(url);
    return res.data;
  } catch (err) {
    console.log(err)
  }
}


module.exports = { getForcast };