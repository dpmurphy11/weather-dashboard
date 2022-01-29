const textSearch = $('#search-text');
const btnSearch = $('#search-button');
const cityButtons = $('#button-cities');
const main = $('main');
const todayDiv = $('.current-weather');
const cardDivs =$('.custom-card');

const apiKey = '74eee0ffef0df6f840ed6df7d1795e48'
var cityResponse = '';

// populate autocomplete widget
var availableTags = [
    "Albany",
    "Boston",
    "Chicago",
    "London"
  ];
  textSearch.autocomplete({
    source: availableTags
  });

main.css('display', 'visible');
// console.log(cardDivs);

$(todayDiv).children('.city').html('City: Boston <img src="https://openweathermap.org/img/w/04d.png">');
$(todayDiv).children('.temp').text('Temp: 99');
$(todayDiv).children('.wind').text('Wind: slow');
$(todayDiv).children('.humidity').text('Humidity: high');
$(todayDiv).children('.uv').html('UV Index: <button class="btn btn-success" disabled>0.00</button>');

cardDivs.each(function(i, card) {
    // console.log(i, this)
    $(card).children('.date').text('3/1/2022');
    $(card).children('.icon').attr('src', 'https://openweathermap.org/img/w/04d.png');
    $(card).children('.temp').text('95');
    $(card).children('.wind').text('fast');
    $(card).children('.humidity').text('high');

    // switch (i) {
    //     case 0:
    //         // day 1
    //         // $(this).children.eq(0)('.date').text('3/3/2022');
    //         $(this).children('.icon').attr('src', 'https://openweathermap.org/img/w/04d.png');
    //         $(this).children('.temp').text('95');
    //         $(this).children('.wind').text('fast');
    //         $(this).children('.humidity').text('high');
    //         break;
    //     case 1:
    //         // day 2
    //         $(this).children('.date').text('3/4/2022');
    //         $(this).children('.icon').attr('src', 'https://openweathermap.org/img/w/04d.png');
    //         $(this).children('.temp').text('95');
    //         $(this).children('.wind').text('fast');
    //         $(this).children('.humidity').text('high');
    //         break;
    //     case 2:
    //         // day 3
    //         $(this).children('.date').text('3/5/2022');
    //         $(this).children('.icon').attr('src', 'https://openweathermap.org/img/w/04d.png');
    //         $(this).children('.temp').text('95');
    //         $(this).children('.wind').text('fast');
    //         $(this).children('.humidity').text('high');
    //         break;
    //     case 3:
    //         // day 4
    //         $(this).children('.date').text('3/6/2022');
    //         $(this).children('.icon').attr('src', 'https://openweathermap.org/img/w/04d.png');
    //         $(this).children('.temp').text('95');
    //         $(this).children('.wind').text('fast');
    //         $(this).children('.humidity').text('high');
    //         break;
    //     case 4:
    //         // day 5
    //         $(this).children('.date').text('3/7/2022');
    //         $(this).children('.icon').attr('src', 'https://openweathermap.org/img/w/04d.png');
    //         $(this).children('.temp').text('95');
    //         $(this).children('.wind').text('fast');
    //         $(this).children('.humidity').text('high');
    //         break;
    // }
})

function callAPI(city) {

    currentWeeatherRequest = 'https://api.openweathermap.org/data/2.5/weather?q=' + city +'&appid=' + apiKey + '&units=imperial';

    // call api for current weather
    fetch(currentWeeatherRequest)
    .then(function (response) {
        if (!response.ok) {
            throw response.json();
        }
        return response.json();
    })
    .then(function (currentWeeatherResponse) {

        console.log('One Day Results:\n----------');
        console.log(currentWeeatherResponse);

        if (!currentWeeatherResponse.length) {
            $('#msg').text('No resulits were found');
        } else {
            $('#msg').text('resulits were found');
            // parse for city name. latitude and longitude
            var cityLat = data.coord.lat;
            var cityLon = data.coord.lon;
            cityResponse = data.name;

            // call api for forcast data passing lat and lon
            forcastWeatherRequest = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + cityLat + '&lon=' + cityLon + '&exclude=hourly,minutely,alerts&appid=' + apiKey + '&units=imperial';

            fetch(forcastWeatherRequest)
            .then(function (response) {
                if (!response.ok) {
                    throw response.json();
                }
                return response.json();
            })
            .then(function (forcastWeatherResponse) {
        
                console.log('Forcast Results:\n----------');
                console.log(forcastWeatherResponse);
        
                if (!forcastWeatherResponse.results.length) {
                    textSearch.attr('placeholder', 'No resulits were found');
                } else {
                    renderResults(forcastWeatherResponse);
                }
            })
        }
    })
    .catch(function (error) {
        console.error(error);
    });
}

function renderResults(objJSON) {
    //
    for (var i = 0; i < objJSON.results.length; i++) {
        console.log(locRes.results[i]);
      }

};

function handleSearchClick(event) {
    event.preventDefault();

    // get the search text
    city = textSearch.val();
    if (!city.trim()) {
        textSearch.attr('placeholder', 'Enter a city name');
        return;
    }

    callAPI(city);
}



btnSearch.on('click', handleSearchClick)
    // var city = $(textSearch.val());

    // call function for calling api
//     var success = callAPI(city);
//     console.log(success);
//     console.log('city' + cityResponse);
    
//     if (success) {
//         // add secondary button
//         var cityButton = $('<button type="button" class="btn btn-secondary btn-lg btn-block"></button>');
//         cityButton.text(cityResponse);
//         cityButtons.append(cityButton);

//     }
// }) 

// cityButtons.on('click', '.btn-secondary', function(event) {
//     // get the search text
//     var btnClicked = $(event.target);
//     var city = btnClicked.text();
//     console.log(city);
//     // textSearch.val(city);
//     // call function for calling api
//     var success = callAPI(city);
    
// })