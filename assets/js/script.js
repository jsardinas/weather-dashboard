var apiKey = '8d807a4bc8daa6edc68bfec5f653ae4c';
var apiBaseUrl = 'https://api.openweathermap.org/data/2.5/weather';


function getWeatherAsync(city, onSuccess){
    let apiUrl = `${apiBaseUrl}?q=${city}&appid=${apiKey}&units=imperial`;
    console.log(apiUrl);
    fetch(apiUrl)
    .then(response =>{return response.json();})
    .then(onSuccess);
}

$(document).ready(()=>{
    $('#searchBtn').on('click', event => {
        let city = $('#cityInput').val();
        getWeatherAsync(city, weather=>{
            console.log(weather);
            console.log($('#featuredCard'));
            $('#featuredCard h2').text(`${city} (${moment().format('M/DD/YYYY')})`);
            $('#temp').text(`${Math.round(weather.main.temp)} °F (feels like ${Math.round(weather.main.feels_like)} °F)`);
            $('#wind').text(`${weather.wind.speed} mph`);
            $('#humidity').text(`${weather.main.humidity} %`);
        });
    })
});
