// my API key from openweathermap
apiKey = '7ac95e30dbc3281b9f2843ec9f3e8192';

// Get html objects

const cityInputEl = $('#city-input');
const cityInputFormEl = $('#city-input-form');
const previousSearchButtonsEl=$('#previous-search-buttons');
const resultsEl = $('#results');
const queryString=document.location.search;

init();

function init() {
  displayIcon()
  cityInputFormEl.submit(handleCityFormSubmit);
  previousSearchButtons('btn btn-secondary w-100 mb-3');
  displayWeather();
}

function handleCityFormSubmit(event) {
  event.preventDefault();

  const cityInputVal = cityInputEl.val().trim();

  if (!cityInputVal) {
    console.error('You need a search input value!');
    return;
  }

  window.location.href="./index.html?name="+cityInputVal;
}

function previousSearchButtons(cssClass='btn') {
  // Display and set event handlers for the buttons with previous city searches

  // At the moment, they are not in any particular order

  for (str in localStorage) {
    // This doesn't exactly filter for items in local storage that are the ones added from this page, but it filters some.
    if (str.includes(",")) {
      var city = getCity(str);
      if (city.name) {
        let newButton = $('<button>').addClass(cssClass)
          .text(str);
        newButton.click(function() {
          window.location.href=localCityURL(city);
        });
        previousSearchButtonsEl.append(newButton);
      }
    }
  }
}

function searchApiCity(city) {
  let cityURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=" + apiKey;

  fetch(cityURL)
    .then(function(response) {
      console.log(response);
      if (response.ok) {
        return response.json();
      } else {
        alert('Error: ' + response.statusText);
      }
    }) 
    .then(function (data) {
      if (data.length === 0) {
        resultsEl.append($("<h2>No data found. Try again!</h2>"));
      } else if (data.length === 1) {
        // save to local storage
        setCity(data[0]);
        // get weather for that city
        window.location.href=localCityURL(data[0]);
      } else {
        // Display list of possible cities
        displayCityList(data);
      }
    });
      
}

function displayCityList(data) {
  // Display list of up to 5 possible cities to then search weather for
  for (let i=0; i<data.length; i++) {
    let cityBox = $("<div>").addClass("row border border-info p-2 m-3");
    let cityDetails = $("<div>").addClass("col-12 col-md-6");
    let submitBox = $("<div>").addClass("col-12 col-md-6");
    let submitButton = $("<button>").addClass("btn btn-info").text("Get Weather");
    let city = cropCityObject(data[i]);
    submitButton.click(function() {
      // save to local storage
      setCity(city);
      window.location.href=localCityURL(city);
    });

    cityDetails.append($("<p>").text(cityString(city)));
    cityDetails.append($("<p>").text("Lat: "+city.lat));
    cityDetails.append($("<p>").text("Lon: "+city.lon));

    

    submitBox.append(submitButton);
    resultsEl.append(cityBox.append(cityDetails).append(submitBox));

  }
}

function localCityURL(city) {
  if (city.state) {
    return "./index.html?lat="+city.lat + "&lon=" +city.lon+"&name="+city.name+"&state="+city.state+"&country="+city.country;
  } else {
    return "./index.html?lat="+city.lat + "&lon=" +city.lon+"&name="+city.name+"&country="+city.country;
  }
}

function cityString(city) {
  if (city.state) {
    return city.name + ", " + city.state + ", " + city.country;
  } else {
    return city.name + ", " + city.country;
  }
}

function cropCityObject(city) {
  // Shortens city data from geocoding to just lat, lon, city name, state, and country
  return {
    name: city.name,
    state: city.state,
    country: city.country,
    lat: city.lat,
    lon: city.lon,
  }
}

function setCity(city) {
  // store the city object into local storage with key "name, state, country" to avoid duplicates
  // (next step: how to get desired order)
  localStorage.setItem(cityString(city),JSON.stringify(city));
}

function getCity(cityString) {
  // gets city object from storage from cityString key
  return JSON.parse(localStorage.getItem(cityString));
}

function displayWeather() {
  if (queryString) {
    queryArray = queryString.slice(1).split("&");
    var locationData = {};
    for (i=0;i<queryArray.length;i++) {
      keyValuePair = queryArray[i].split("=");
      locationData[keyValuePair[0]] = keyValuePair[1];
    }
    console.log(locationData);
    if (locationData.lat&&locationData.lon) {

      resultsEl.append($('<div>').addClass('today-card container-fluid border').append($('<h2>').addClass('today-heading').text(cityString(locationData))));


      searchApiWeather("https://api.openweathermap.org/data/2.5/forecast?lat="+locationData.lat+"&lon="+locationData.lon+"&appid="+apiKey+"&units=imperial");
    } else if (locationData.name) {
      searchApiCity(locationData.name);
    } else {
      resultsEl.append($("<h2>404 Not found. Try again!</h2>"));
    }
  }
}

function searchApiWeather(weatherURL) {
  // Get weather data using latitude and longitude
  fetch(weatherURL)
    .then(function(response) {
      console.log(response);
      if (response.ok) {
        return response.json();
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .then(function (data) {
      displayWeatherData(data);
    }); 
}

function displayIcon() {
  // Set the size of the Weather Icon in the header to the font-size of the header
  $(".icon").append($("<img id='weather-icon' src='./assets/images/favicon/weather-transparent-favicon-16x16.svg'>").css("width",$("h1").css("line-height")));
}

function displayWeatherData(data) {
  // Uses the data from the weather api to fill in the rest of the forecast
  console.log(data);
  displayTodaysWeather(data.list[0]);
  for (i=7;i<40;i+=8) {
    displayForecastDay(data.list[i]);
  }
}

function displayTodaysWeather(dataTimestamp) {
  // Fill in the card for the current weather, given that the location text is already in the heading
  // Data timestamp is just one of the objects in the array data.list recieved from openweathermap

  let todayCard = $(".today-card");
  appendWeatherDetails(todayCard,dataTimestamp);

}

function displayForecastDay(dataTimestamp) {
  // Add a card into the forecast box containing weather for the given timestamp
  // Data timestamp is just one of the objects in the array data.list recieved from openweathermap

  let forecastCard=$("<div>").addClass("forecast-card");
  appendWeatherDetails(forecastCard,dataTimestamp);
  resultsEl.append(forecastCard);
}

function appendWeatherDetails(JQueryHTMLObject,dataTimestamp) {
  // appends to a JQuery HTML Object <div>s containing weather data for the particular timestamp

  // If there is already a heading object

  if (JQueryHTMLObject.children().length) {
    console.log("True, "+dataTimestamp.dt_txt);
    JQueryHTMLObject.children().append($("<span>")
      .text(" ("+dataTimestamp.dt_txt+")"));
  } else {
    console.log("False, "+dataTimestamp.dt_txt);
    JQueryHTMLObject.append($("<div>")
      .text(dataTimestamp.dt_txt));
  }
  JQueryHTMLObject.append($("<div>")
    .text("Temperature: "+dataTimestamp.main.temp+"°F"));
  JQueryHTMLObject.append($("<div>")
    .text("Wind: "+dataTimestamp.wind.speed+" MPH"));
  JQueryHTMLObject.append($("<div>")
    .text("Humidity: "+dataTimestamp.main.humidity+"%"));
}

// I'd like to first sort the data by date, so I can get the high and low temps for a day, for example




//$.ajax({
//  url: "/api/getWeather",
//  data: {
//    zipcode: 97201
//  },
//  success: function( result ) {
//    $( "#weather-temp" ).html( "<strong>" + result + "</strong> degrees" );
//  }
//});

//api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

//http://api.openweathermap.org/geo/1.0/zip?zip={zip code},{country code}&appid={API key}
