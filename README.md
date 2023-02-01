# Capstone Two

### Backend - API and Database Schema

------

When planning for a trip, travelers often struggle to pack for destinations when they aren't familiar with the location's climate. Also most people  notoriously over-pack for trips, not knowing how many articles of clothing they actually need. The goal of packable is to take the guesswork out of the packing experience. By pulling for a locations past weather data, a user can enter their trip dates and destination, and see likely weather conditions for when they will be there. Further, the app will generate a template packing list based on the number of days the user will be traveling and the climate of their destination. The packing list can then be edited and saved to there user profile. 

------

#### API Info

Packable uses the [Timeline Weather API from the Visual Crossing](https://www.visualcrossing.com/resources/documentation/weather-api/weather-api-documentation/). The Timeline API lets the app retrieve predected forcast data based on historical observations, current 15-day forecasts, and statistical weather forecasts. 

**Example http request for future probably forcast in New York, NY**:

`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/new%20york%2C%20ny/2023-05-25/2023-05-27?unitGroup=us&key=[API Key]&contentType=json`

##### Returned JSON Data

```json
{
   "queryCost": 3,
   "latitude": 40.7146,
   "longitude": -74.0071,
   "resolvedAddress": "New York, NY, United States",
   "address": "new york, ny",
   "timezone": "America/New_York",
   "tzoffset": -4,
   "days": [
      {
       "datetime": "2023-05-25",
       "datetimeEpoch": 1684987200,
       "tempmax": 72.9,
       "tempmin": 57.5,
       "temp": 65,
       "feelslikemax": 0,
       "feelslikemin": 0,
       "feelslike": 83.2,
       ...
      },
      {
        "datetime": "2023-05-26",
        "datetimeEpoch": 1685073600,
        "tempmax": 75.1,
        "tempmin": 60.3,
        "temp": 67.2,
        "feelslikemax": 0.0,
        "feelslikemin": 0.0,
        "feelslike": 86.4,
        ...
      },
      {
        "datetime": "2023-05-27",
        "datetimeEpoch": 1685160000,
        "tempmax": 77.4,
        "tempmin": 60.9,
        "temp": 68.1,
        "feelslikemax": 0.0,
        "feelslikemin": 0.0,
        "feelslike": 83.9,
        ...
      }
   ]
}
```

------

#### Database Schema

![](/Users/sashahome/Dropbox/Sasha/SpringBoard/Capstone-2-project/backend/database-schema.png)

------

#### User Flow

![](/Users/sashahome/Dropbox/Sasha/SpringBoard/Capstone-2-proposal/user-flow.jpeg)

------

#### Security

User accounts with hashed passwords will allow users to save location searches and associated packing lists they create for trips. 

Any user can see the homepage showing location search, which when submitted will show a user the current conditions in the location they search.

Only logged in users can:

* Search locations with planned travel dates
* Generate packing list based on travel location and climate
* Add, update and save packing lists and location searches

