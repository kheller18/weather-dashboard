// making sure html is loaded first
$(document).ready(function() {
    var city;
    var temp;
    var weatherTemp;
    var apiKey = "54ea5276d8943e943c85e5932fdd782a";
    var cities = [];
    var today, iconID, uv, forecast, temp, lat, long, weatherTemp, lastCity, tempDate, val, uvTemp;
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
        
    // app gets kicked off here    
    displayLastCity();
    renderCities();

    function generateWeatherData(city) {
        if (city != null || city != undefined|| city != "") {               
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
                    iconID = data;
                    console.log(iconID);
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
                    console.log(iconID);
                    console.log(uv);
                    console.log(forecast);
                    getForecast(today, iconID, uv, forecast);
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
            a.addClass("priorSearches");
            a.attr('id', i);
            a.attr('value', cities[i]);
            a.text(cities[i])
            $(".search-History").append(a);
        }
    }

    function cityUpperCase(city) {
        return city.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    function storeCities(city) {
        console.log(city)
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

    function getForecast (today, iconID, uv, forecast) {
        forecastCounter = 0;
        console.log(today);
        console.log(iconID);
        console.log(uv);
        tempDate = formatDate(uv.date_iso);
        temp = convertTemp(today.main.temp);
        uvTemp = uv.value;
        
        $(".city").html(`<h2>${ today.name } (${ tempDate }) <img src=${ iconID.url } /></h2>`);
        $(".temperature").html(`<p>Temperature: ${ temp } &#176;F</p>`);
        $(".humidity").html(`<p>Humidity: ${ today.main.humidity }%</p>`);
        $(".windSpeed").html(`<p>Wind Speed: ${ today.wind.speed } MPH</p>`);
        $(".uvIndex").html(`<p>UV Index: <span id="uvColor">${ uvTemp }</span></p>`);
        styleUV(uvTemp);

        for (i = 0; i < forecast.list.length - 1; i++) {
            if (forecast.list[i].dt_txt.includes("21:00:00")) {
                sdate = forecast.list[i].dt_txt;
                console.log(sdate);
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
        console.log(forecast);
    }

    function getIcon(iconSymbol) {
        url = `http://openweathermap.org/img/wn/${ iconSymbol }@2x.png`;
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

    function styleUV(value) {
        var displayUV = $("#uvColor");
        displayUV.removeClass("uvColor-low", "uvColor-moderate", "uvColor-high", "uvColor-very-high", "uvColor-extreme");
        if ((value >= 0) && (value < 3)) {
            displayUV.addClass("uvColor-low");
        } else if ((value >= 3) && (value < 6)) {
            displayUV.addClass("uvColor-moderate");
        } else if ((value >= 6) && (value < 8)) {
            displayUV.addClass("uvColor-high");
        } else if ((value >= 8) && (value < 11)) {
            displayUV.addClass("uvColor-very-high");
        } else {
            displayUV.addClass("uvColor-extreme");
        }
    }

    function convertTemp (temperature) {
        temperature = (((temperature - 273.15) * 1.8) + 32).toFixed(0);
        return temperature;
    }

    async function validateCity(location) {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${ location }&appid=${ apiKey }`)
        const data = await response.json()
        console.log(data);
        console.log(data.cod)
        if (data.cod == "200") {
            storeCities(city);
            generateWeatherData(city);
        } else {
            console.log("didn't work")
        }
    }

    

    $("form").submit(function(e) {
        e.preventDefault();
        city = $("#searchCity").val();
        validateCity(city);
    });

    $(".search-History").on("click", function(event) {
        city = event.target.attributes[2].nodeValue;
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