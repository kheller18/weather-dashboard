// making sure html is loaded first
$(document).ready(function() {
    var city;
    var temp;
    var weatherTemp;
    var icons = [];
    var apiKey = "54ea5276d8943e943c85e5932fdd782a";
    var cities = [];
    var today, icon, uv, forecast, temp, lat, long, weatherTemp, lastCity, tempDate;
    var forecastData = [];

    displayLastCity();
    renderCities();
/* model array 





*/
    function generateWeatherData(city) {
        if (city != null || city != undefined || city != "") {               
            fetch(`http://api.openweathermap.org/data/2.5/weather?q=${ city }&appid=${ apiKey }`)
                .then(function (response) {
                    return response.json();
                }).then(function (data) {
                    weatherTemp = data.weather[0].icon
                    today = data;
                    return fetch(`http://openweathermap.org/img/wn/${ weatherTemp }@2x.png`);
                }).then(function (response) {
                    return response;
                }).then(function (data) {
                    icon = data;
                    console.log(icon);
                    lat =  today.coord.lat;
                    long = today.coord.lon;
                    return fetch(`http://api.openweathermap.org/data/2.5/uvi?appid=${ apiKey }&lat=${ lat }&lon=${ long }`)
                }).then(function (response) {
                    return response.json()
                }).then(function (data) {
                    uv = data;
                    return fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${ city }&appid=${ apiKey }`)
                }).then(function (response) {
                    return response.json()
                }).then (function (data) {
                    forecast = data;
                    console.log(today);
                    console.log(icon);
                    console.log(uv);
                    console.log(forecast);
                    temp = ((today.main.temp -273.15) * 1.8 + 32).toFixed(1);
                    tempDate = uv.date_iso;
                    console.log(tempDate);
                    tempDate = tempDate.split("T");
                    tempDate = tempDate[0];
                    //tempDate.replace('-','/');
                    console.log(tempDate);

                    getForecast(today, icon, uv, forecast);



                    
                    renderCities();

                }).catch(function (error) {
                    console.log(error);
                });  
        }
    }
    
    
    function renderCities() {
        $(".search-History").empty();

        if (JSON.parse(localStorage.getItem("cities")) != null) {
            cities = JSON.parse(localStorage.getItem("cities"));
        }
        for (var i = cities.length - 1; i >= 0; i--) {
            var a = $("<li>");
            a.text(cities[i])
            $(".search-History").append(a);
        }
    }

    function storeCities(city) {
        city = cityUpperCase(city);
        if (JSON.parse(localStorage.getItem("cities")) != null) {
            cities = JSON.parse(localStorage.getItem("cities"));
        }
        cities.push(city);
        localStorage.setItem('cities', JSON.stringify(cities));
        renderCities();
    }

    function displayLastCity() {
        if (JSON.parse(localStorage.getItem("cities")) != null) {
            cities = JSON.parse(localStorage.getItem("cities"));
            lastCity = cities[cities.length - 1];
            generateWeatherData(lastCity);
        }
        

    }

    //function formatDate() {

    //}

    

    function cityUpperCase(city) {
        return city.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    function getForecast (today, icon, uv, forecast) {

        console.log(today);
        console.log(icon);
        console.log(uv);
        console.log(forecast);

         

        $(".city").html(`<h2>${ today.name } (${ tempDate }) <img src=${ icon.url } /></h2>`);
        $(".temperature").html(`<p>Temperature: ${ temp } F</p>`);
        $(".humidity").html(`<p>Humidity: ${ today.main.humidity }%</p>`);
        $(".windSpeed").html(`<p>Wind Speed: ${ today.wind.speed } MPH</p>`);
        $(".uvIndex").html(`<p>UV Index: ${ uv.value }</p>`);

        for (i = 0; i < forecast.list.length - 1; i++) {
            console.log("hello")
        }

        $("#forecast-1").html((`<h6> ${ forecast.list[0].dt_txt }  </h6>`));
        $("#forecast-1").append(`<p> ${ forecast.list[0].main.temp} F</p>`);
        $("#forecast-1").append(`<p>Temp: ${ forecast.list[0].main.temp} F</p>`);
        $("#forecast-1").append(`<p>Humidity: ${ forecast.list[0].main.humidity}%</p>`);
        $("#forecast-2").html((`<h6> ${ forecast.list[8].dt_txt }  </h6>`));
        $("#forecast-2").append(`<p>Temp: ${ forecast.list[8].main.temp} F</p>`);
        $("#forecast-2").append(`<p>Humidity: ${ forecast.list[8].main.humidity}%</p>`);
        $("#forecast-3").html((`<h6> ${ forecast.list[16].dt_txt }  </h6>`));
        $("#forecast-3").append(`<p>Temp: ${ forecast.list[16].main.temp} F</p>`);
        $("#forecast-3").append(`<p>Humidity: ${ forecast.list[16].main.humidity}%</p>`);
        $("#forecast-4").html((`<h6> ${ forecast.list[24].dt_txt }  </h6>`));
        $("#forecast-4").append(`<p>Temp: ${ forecast.list[24].main.temp} F</p>`);
        $("#forecast-4").append(`<p>Humidity: ${ forecast.list[24].main.humidity}%</p>`);
        $("#forecast-5").html((`<h6> ${ forecast.list[32].dt_txt }  </h6>`));
        $("#forecast-5").append(`<p>Temp: ${ forecast.list[32].main.temp} F</p>`);
        $("#forecast-5").append(`<p>Humidity: ${ forecast.list[32].main.humidity}%</p>`);
    }

    //function getIcons() {

    //}

    $("form").submit(function(e) {
        e.preventDefault();
        city = $("#searchCity").val();
        storeCities(city);
        generateWeatherData(city);
    });

    async function fetchCity(city) {
        const response = await fetch("http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=54ea5276d8943e943c85e5932fdd782a")
        const data = await response.json()
        return data;
    }
        
    async function fetchImg(wpic) {
        const response = await fetch("http://openweathermap.org/img/wn/" + wpic + "@2x.png")
        const data = await response
        return data;
    }
                    
       
    

});