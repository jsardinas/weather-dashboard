const apiKey = '8d807a4bc8daa6edc68bfec5f653ae4c';
var apiBaseUrl = 'https://api.openweathermap.org/data/2.5';
var lat;
var lon;
var searchHistory = [];
const maxHistoryCapacity = 10;
const historyKey = "history";
var historyElement;
var forecastIds;
const uvIndexColorCode = ['#289500','#289500','#289500',
                        '#F7E400','#F7E400','#F7E400',
                        '#F85900','#F85900',
                        '#D80010','#D80010',
                        '#6B49C8'];

function getForecastAsync(lat, lon){
    console.log(lat, lon);
    let apiUrl = `${apiBaseUrl}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}&units=imperial`;
    return fetch(apiUrl)
    .then(response => {return response.json();});
}

function getWeatherAsync(city, onSuccess){
    let apiUrl = `${apiBaseUrl}/weather?q=${city}&appid=${apiKey}&units=imperial`;
    fetch(apiUrl)
    .then(response =>{return response.json();})
    .then(onSuccess);
}

function getLatLonAsync(city){
    let apiUrl = `${apiBaseUrl}/weather?q=${city}&appid=${apiKey}`;
    return fetch(apiUrl)
    .then(response =>{return response.json();})
    .then(json => {
        if(json.cod == 200)
            return {'lat': json.coord.lat, 'lon': json.coord.lon};
        else
            return Promise.reject();
    })
    .catch(() => {return Promise.reject()});
}

$(document).ready(()=>{
    forecastIds = [1,2,3,4,5].map(x=>`forecast${x}`);

    historyElement = $('.history')[0];
    loadHistory();

    $('#searchBtn').on('click', event => {
        let city = $('#cityInput').val();
        getWeather(city);
    });
});

function getWeather(city){
    getLatLonAsync(city)
    .then(coord => {return getForecastAsync(coord.lat, coord.lon)})
    .then(weather => {
        //featured card
        $('#featuredCard h2').text(`${city} (${moment().format('M/DD/YYYY')})`);
        $('#temp').text(`${Math.round(weather.current.temp)} °F (feels like ${Math.round(weather.current.feels_like)} °F)`);
        $('#wind').text(`${weather.current.wind_speed} mph`);
        $('#humidity').text(`${weather.current.humidity} %`);
        $('#uvIndex').text(`${weather.current.uvi}`);
        let uvIndex = weather.current.uvi >= 11 ? 11 : Math.floor(weather.current.uvi);
        console.log(uvIndex);
        $('#uvIndex').css('background-color', uvIndexColorCode[uvIndex]);
        
        //forecast cards
        var forecast = weather.daily;
        
        for(let i = 1; i <= 5; ++i){
            $(`#${forecastIds[i-1]} h5`).text(moment.unix(forecast[i].dt).format('M/DD/YYYY'));
            $(`#temp${i}`).text(`${Math.round(forecast[i].temp.day)} °F`);
            $(`#wind${i}`).text(`${forecast[i].wind_speed} mph`);
            $(`#humidity${i}`).text(`${forecast[i].humidity} %`);
        }

        //save lookup history
        let idx = 0;
        while (idx < searchHistory.length && searchHistory[idx] != city) ++idx;
        if (idx < searchHistory.length){
            searchHistory.splice(idx, 1);
        }
        searchHistory.push(city);
        if (searchHistory.length > maxHistoryCapacity)
        searchHistory.shift();
        window.localStorage.setItem(historyKey, JSON.stringify(searchHistory));
        updateHistory(searchHistory);
    })
    .catch(() => {
        $('#featuredCard h2').text(`${city} aint no city I've heard of`);
        $('#temp').text("");
        $('#wind').text("");
        $('#humidity').text("");
        $('#uvIndex').text("");

        for(let i = 1; i <= 5; ++i){
            $(`#${forecastIds[i-1]} h5`).text("");
            $(`#temp${i}`).text("");
            $(`#wind${i}`).text("");
            $(`#humidity${i}`).text("");
        }
    });
}

function loadHistory(){
    console.log('load history');
    searchHistory = JSON.parse(window.localStorage.getItem(historyKey));
    updateHistory(searchHistory);
}

function updateHistory(history){
    removeAllChildren(historyElement);
    for(let i = history.length-1; i >= 0; --i){
        let cityDiv = $(`<div>${history[i]}</div>`).appendTo(historyElement);
        cityDiv.addClass('historyItem');
        cityDiv.on('click', event=>{getWeather(event.target.textContent);})
    }
}

function removeAllChildren(element){
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}