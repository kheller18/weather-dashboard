// making sure html is loaded first
$(document).ready(function() {
    var city;
    var temp;
    var weatherTemp;
    var apiKey = "54ea5276d8943e943c85e5932fdd782a";
    var cities = [];
    var today, icon, uv, forecast, temp, lat, long, weatherTemp, lastCity, tempDate;
    var date, forecastIcon, temperature, humidity;
    let forecastCounter = 0;
    let forecastTags = ["#forecast-1", "#forecast-2", "#forecast-3", "#forecast-4", "#forecast-5"]
    let forecastData = [
        {
            date,
            forecastIcon,
            temperature,
            humidity
        }, 
        {
            date,
            forecastIcon,
            temperature,
            humidity
        }, 
        {
            date,
            forecastIcon,
            temperature,
            humidity
        }, 
        {
            date,
            forecastIcon,
            temperature,
            humidity
        }, 
        {
            date,
            forecastIcon,
            temperature,
            humidity
        }
    ]   
        
    
    console.log(forecastData);
    displayLastCity();
    renderCities();

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
        tempDate = formatDate(uv.date_iso);
        temp = convertTemp(today.main.temp);
        $(".city").html(`<h2>${ today.name } (${ tempDate }) <img src=${ icon.url } /></h2>`);
        $(".temperature").html(`<p>Temperature: ${ temp } F</p>`);
        $(".humidity").html(`<p>Humidity: ${ today.main.humidity }%</p>`);
        $(".windSpeed").html(`<p>Wind Speed: ${ today.wind.speed } MPH</p>`);
        $(".uvIndex").html(`<p>UV Index: ${ uv.value }</p>`);

        for (i = 0; i < forecast.list.length - 1; i++) {
            if (forecast.list[i].dt_txt.includes("15:00:00")) {
                
                forecastData[forecastCounter].date = formatDate(forecast.list[i].dt_txt);
                forecastData[forecastCounter].forecastIcon = getIcon(forecast.list[i].weather[0].icon);
                forecastData[forecastCounter].temperature = convertTemp(forecast.list[i].main.temp);
                forecastData[forecastCounter].humidity = forecast.list[i].main.humidity;
                $(forecastTags[forecastCounter]).html((`<h6> ${ forecastData[forecastCounter].date }  </h6>`));
                $(forecastTags[forecastCounter]).append(`<p><img src=${ forecastData[forecastCounter].forecastIcon } /></p>`);
                $(forecastTags[forecastCounter]).append(`<p>Temp: ${ forecastData[forecastCounter].temperature } &#176;F</p>`);
                $(forecastTags[forecastCounter]).append(`<p>Humidity: ${ forecastData[forecastCounter].humidity }%</p>`);
                forecastCounter++;
            }
        }
        console.log(forecastData);
    }

    function getIcon(icon) {
        url = `http://openweathermap.org/img/wn/${ icon }@2x.png`;
        return url;
    }

    function formatDate(newDate) {
        //newDate = uv.date_iso;
        if (newDate.includes('T')) {
            newDate = newDate.split('T');
            newDate = newDate[0];
        } else {
            newDate = newDate.split(" ");
            newDate = newDate[0];
        }
        newDate = newDate.match(/\d+/g),
        year = newDate[0].substring(2), // get only two digits
        day = newDate[1], month = newDate[2];

        return day+'/'+month+'/'+year;
    }

    function convertTemp (temperature) {
        temperature = ((temperature - 273.15) * 1.8 + 32).toFixed(0);
        return temperature;
    }

    $("form").submit(function(e) {
        e.preventDefault();
        city = $("#searchCity").val();
        storeCities(city);
        generateWeatherData(city);
    });

   /* async function fetchCity(city) {
        const response = await fetch("http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=54ea5276d8943e943c85e5932fdd782a")
        const data = await response.json()
        return data;
    }
        
    async function fetchImg(wpic) {
        const response = await fetch("http://openweathermap.org/img/wn/" + wpic + "@2x.png")
        const data = await response
        return data;
     } */
                    
       
    

});