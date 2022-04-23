var apiKey = '8d807a4bc8daa6edc68bfec5f653ae4c';
var apiBaseUrl = 'https://api.openweathermap.org/data/2.5';
var lat;
var lon;

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
    .then(json => {return {'lat': json.coord.lat, 'lon': json.coord.lon};});
}

$(document).ready(()=>{
    $('#searchBtn').on('click', event => {
        let city = $('#cityInput').val();
        getLatLonAsync(city)
        .then(coord => {return getForecastAsync(coord.lat, coord.lon)})
        .then(weather => {
            $('#featuredCard h2').text(`${city} (${moment().format('M/DD/YYYY')})`);
            $('#temp').text(`${Math.round(weather.current.temp)} °F (feels like ${Math.round(weather.current.feels_like)} °F)`);
            $('#wind').text(`${weather.current.wind_speed} mph`);
            $('#humidity').text(`${weather.current.humidity} %`);
            $('#uvIndex').text(`${weather.current.uvi}`);
            var forecast = weather.daily;

            var forecastIds = [1,2,3,4,5].map(x=>`forecast${x}`);
            for(let i = 1; i <= 5; ++i){
                $(`#${forecastIds[i-1]} h4`).text(moment.unix(forecast[i].dt).format('M/DD/YYYY'));
                $(`#temp${i}`).text(`${Math.round(forecast[i].temp.day)} °F`);
                $(`#wind${i}`).text(`${forecast[i].wind_speed} mph`);
                $(`#humidity${i}`).text(`${forecast[i].humidity} %`);
            }
        });
    })
});

