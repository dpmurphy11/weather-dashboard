const textSearch = $('#search-text');
const btnSearch = $('#search-button');
const cityButtons = $('#button-cities');
const main = $('main');
const todayDiv = $('.current-weather');
const cardDivs =$('.custom-card');
const apiKey = '74eee0ffef0df6f840ed6df7d1795e48'

// render saved cities to secondary buttons list
 var cities = JSON.parse(localStorage.getItem("cities")) || [];
if (cities.length) {
    cities.sort();
    cities.forEach(city => {
        // add secondary button
        var cityButton = $('<button type="button" class="btn btn-secondary btn-lg btn-block"></button>');
        cityButton.text(city);
        cityButtons.append(cityButton);
    });
}

// populate autocomplete widget
var availableTags = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San Jose",
    "Austin",
    "Jacksonville",
    "Fort Worth",
    "Columbus",
    "Indianapolis",
    "Charlotte",
    "San Francisco",
    "Seattle",
    "Denver",
    "Washington",
    "Nashville",
    "Oklahoma City",
    "El Paso",
    "Boston",
    "Portland",
    "Las Vegas",
    "Detroit",
    "Memphis",
    "Louisville",
    "Baltimore",
    "Milwaukee",
    "Albuquerque",
    "Tucson",
    "Fresno",
    "Sacramento",
    "Kansas City",
    "Mesa",
    "Atlanta",
    "Omaha",
    "Colorado Springs",
    "Raleigh",
    "Long Beach",
    "Virginia Beach",
    "Miami",
    "Oakland",
    "Minneapolis",
    "Tulsa",
    "Bakersfield",
    "Wichita",
    "Arlington",
    "Tokyo",
    "Delhi",
    "Shanghai",
    "Sao Paulo",
    "Mexico City",
    "Beijing",
    "Mumbai",
    "London",
    "Rome",
    "Madrid",
    "Berlin",
    "Moscow",
];
  textSearch.autocomplete({
    source: availableTags
  });

// hide main content
main.css('display', 'none');
// hide user message
toggleMsg('hidden');

function renderResults(current, forcast) {

    // console.log(current);
    // console.log(forcast);

    // set the color of the UV button
    var uvColor = 'uv-protect';
    if (forcast.current.uvi < 3) {
        uvColor = 'uv-good';
    } else if (forcast.current.uvi > 2 && forcast.current.uvi < 6) {
        uvColor = 'uv-medium';
    } else if (forcast.current.uvi > 5 && forcast.current.uvi < 8) {
        uvColor = 'uv-high';
    } else if (forcast.current.uvi > 7 && forcast.current.uvi < 11) {
        uvColor = 'uv-very-high';
    } else {
        uvColor = 'btn-danger';
    }

    // populate today's weather
    $(todayDiv).children('.city').html(current.name + ' (' + moment.unix(current.dt).format('ddd, MMM Do YYYY') + ') ' + '<img src="https://openweathermap.org/img/w/' + forcast.current.weather[0].icon + '.png">');
    $(todayDiv).children('.temp').text('Temp: ' + forcast.current.temp + String.fromCharCode(176));
    $(todayDiv).children('.wind').text('Wind: ' + forcast.current.wind_speed + ' mph');
    $(todayDiv).children('.humidity').text('Humidity: ' + forcast.current.humidity + '%');
    $(todayDiv).children('.uv').html('UV Index: <button class="btn ' + uvColor + '" disabled>' + forcast.current.uvi + '</button>');

    // populate forcast cards
    // console.log(cardDivs);
    cardDivs.each(function(i, card) {
        // console.log(i, this)
        $(card).children('.date').text(moment.unix(forcast.daily[i+1].dt).format('MM/D/YYYY'));
        $(card).children('.icon').attr('src', 'https://openweathermap.org/img/w/' + forcast.daily[i+1].weather[0].icon + '.png');
        $(card).children('.temp').text('Temp: ' + forcast.daily[i+1].temp.day + String.fromCharCode(176));
        $(card).children('.wind').text('Wind: ' + forcast.daily[i+1].wind_speed + ' mph');
        $(card).children('.humidity').text('Humidity: ' + forcast.daily[i+1].humidity + '%');
    })

    // show main content
    main.css('display', 'block');

    //save city to local storage
    var cityResponse = current.name;
    if (!cities.includes(cityResponse)) {
        cities.push(cityResponse);
        localStorage.setItem("cities", JSON.stringify(cities));
        // add secondary button
        var cityButton = $('<button type="button" class="btn btn-secondary btn-lg btn-block"></button>');
        cityButton.text(cityResponse);
        cityButtons.append(cityButton);
    }
    // put last saved city in text input
    textSearch.val(cityResponse);
}

function callAPI(city) {

    var currentWeatherRequest = 'https://api.openweathermap.org/data/2.5/weather?q=' + city +'&appid=' + apiKey + '&units=imperial';

    // call api for current weather
    fetch(currentWeatherRequest)
    
    .then(function (response) {
        // throw error for any type of exception
        if (!response.ok) {
            // throw response.json();
            throw Error(response.json());
        }

        return response.json();
    })

    // get the javascript object
    .then(function (currentWeatherResponse) {

        // make sure object isn't empty
        if (!Object.getOwnPropertyNames(currentWeatherResponse).length) {
            throw Error(currentWeatherResponse);
            // $('#msg').text('No resulits were found');
        } else {
            // parse for latitude and longitude
            var cityLat = currentWeatherResponse.coord.lat;
            var cityLon = currentWeatherResponse.coord.lon;

            // call api for forcast data passing lat and lon
            var forcastWeatherRequest = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + cityLat + '&lon=' + cityLon + '&exclude=hourly,minutely,alerts&appid=' + apiKey + '&units=imperial';

            fetch(forcastWeatherRequest)
            .then(function (response) {
                if (!response.ok) {
                    // throw response.json();
                    throw Error(response.json());
                }
                return response.json();
            })
            .then(function (forcastWeatherResponse) {
        
                // make sure object isn't empty
                if (!Object.getOwnPropertyNames(forcastWeatherResponse).length) {
                    throw Error(forcastWeatherResponse);
                }
                // output data to browser
                renderResults(currentWeatherResponse, forcastWeatherResponse);
            })
        }
    })

    .catch(function(err) {
        console.error(err);
        // TODO: parse the error and show better message
        $('#msg').text('No resulits were found. Try again.' );
        // show user message
        toggleMsg('visible');
    });
}

function handleSearchClick(event) {
    event.preventDefault();

    // hide user message
    toggleMsg('hidden');

    // hide main content
    main.css('display', 'none');

    // get the search text
    city = textSearch.val();
    if (!city.trim()) {
        $('#msg').text('Please enter a city name.' );
        toggleMsg('visible');
        return;
    }

    callAPI(city);
}

// use event delegation incase btn-secondary doesn't exist
cityButtons.on('click', '.btn-secondary', function(event) {
    // get the search text
    var btnClicked = $(event.target);
    var city = btnClicked.text();
    // console.log(city);

    // call function for calling api
    callAPI(city);
    
})

function toggleMsg(msgState) {
    // show or hide user message
    if (msgState == 'hidden') {
        $('#msg').removeClass('block');
        $('#msg').addClass('hidden');
    }else {
        $('#msg').removeClass('hidden');
        $('#msg').addClass('block');
    }
}

btnSearch.on('click', handleSearchClick)
