// making sure html is loaded first
$(document).ready(function() {
    var city;
    var cityVal;
    var temp;
    var iconURL;
    var weatherTemp;
    var apiKey = "54ea5276d8943e943c85e5932fdd782a";
    var cities = [];
    var today, iconID, uv, forecast, temp, lat, long, weatherTemp, lastCity, tempDate, uvTemp;
    var date, forecastIcon, temperature, humidity;
    var currDate;
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
                    cityVal = data;
                    weatherTemp = data.weather[0].icon;
                    lat =  data.coord.lat;
                    long = data.coord.lon;
                    return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${ lat }&lon=${ long }&exclude=minutely&appid=${ apiKey }`)
                }).then(function (response) {
                    return response.json()
                }).then(function (data) {
                    forecast = data;
                    getForecast(cityVal, forecast);
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
            var li = $("<li>");
            li.addClass("priorSearches");
            li.attr('id', i);
            li.attr('value', cities[i]);
            li.text(cities[i])
            $(".search-History").append(li);
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

    function getForecast (cityVal, forecast) {
        forecastCounter = 0;
        console.log(cityVal)
        console.log(forecast)
      
        tempDate = forecast.current.dt;
        

        tempDate = formatDate(tempDate);
        temp = forecast.current.temp;
        temp = convertTemp(temp);
        uvTemp = forecast.current.uvi;
        iconURL = forecast.current.weather[0].icon;
        iconURL = getIcon(iconURL)
        
        $(".city").html(`<h2>${ cityVal.name } (${ tempDate }) <img src=${ iconURL } /></h2>`);
        $(".temperature").html(`<p>Temperature: ${ temp } &#176;F</p>`);
        $(".humidity").html(`<p>Humidity: ${ forecast.current.humidity }%</p>`);
        $(".windSpeed").html(`<p>Wind Speed: ${ forecast.current.wind_speed } MPH</p>`);
        $(".uvIndex").html(`<p>UV Index: <span id="uvColor">${ uvTemp }</span></p>`);
        styleUV(uvTemp);

        for (i = 1; i < forecast.daily.length - 2; i++) {
            
            sdate = forecast.daily[i].dt;
            console.log(sdate);
            forecastData[forecastCounter].date = formatDate(forecast.daily[i].dt);
            forecastData[forecastCounter].forecastIcon = getIcon(forecast.daily[i].weather[0].icon);
            forecastData[forecastCounter].temperature = convertTemp(forecast.daily[i].temp.max);
            forecastData[forecastCounter].humidity = forecast.daily[i].humidity;
            $(forecastTags[forecastCounter]).html((`<h6> ${ forecastData[forecastCounter].date }  </h6>`));
            $(forecastTags[forecastCounter]).append(`<p><img src=${ forecastData[forecastCounter].forecastIcon } /></p>`);
            $(forecastTags[forecastCounter]).append(`<p>Temp: ${ forecastData[forecastCounter].temperature } &#176;F</p>`);
            $(forecastTags[forecastCounter]).append(`<p>Humidity: ${ forecastData[forecastCounter].humidity }%</p>`);
            forecastCounter++;
            
        
        }
        console.log(forecastData);
        console.log(forecast);
    }

    function getIcon(iconSymbol) {
        url = `http://openweathermap.org/img/wn/${ iconSymbol }@2x.png`;
        return url;
    }

    function formatDate(tempDate) {
        tempDate = (new Date(tempDate * 1000)).toLocaleString();
        tempDate = tempDate.split(",");
        tempDate = tempDate[0];
        return tempDate;
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

    function convertUTCToLocal(utcDate) {
        console.log(utcDate);
        var newDate = new Date(utcDate.getTime()+utcDate.getTimezoneOffset()*60*1000);

        var offset = utcDate.getTimezoneOffset() / 60;
        var hours = utcDate.getHours();

        newDate.setHours(hours - offset);
        console.log(newDate);
        return newDate;
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