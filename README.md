# Weather Dashboard

## Description

## User Story

```
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly
```

## Acceptance Criteria

```
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
```

## Comments and future plans

1. I now understand that local storage is for the whole browser and not just single websites or webpages, since I found data from my previous projects in there.  I wonder if there is a standard or preferred way to mark which data came from your site, to make retrieval easier and to not overwrite something else by accident.

1. Currently, the JavaScript file creates whole new elements.  I think I would like to restructure it so that more is set up in the HTML.  Not-in-use containers would be set to `display: none`, and the JavaScript file would then fill in with text the empty elements.  I think that would make styling much easier to read and edit, since I'm doing most of it by adding Bootstrap classes.

2. I would like you to also be able to enter a zip code in addition to a city name.  I would have it see if your input is formatted like a zip code, and then use that function of the Geocoding API.

3. The Geocoding API returns these two-character country codes.  I did some fiddling to turn a table of these codes into an object to look up country names by their codes.  Unfortunately, that table was optimized for sorting alphabetically by name, so "(the)" is always put at the end if that's how the country name starts.  It definitely looks a little funny.  The list is short enough that I could go edit it to change the country names into a preferred format.