// making sure html is loaded first
$(document).ready(function() {
    var city;
    var temp;
    var a;
    var b;
    var weatherTemp;
    var post;
    icon = [];

    
    $("form").submit(function(e) {
        e.preventDefault();
        city = $("#searchCity").val();

        console.log(city);
        if (city != null || city != undefined || city != "") {   
            
            // fetchCity(city).then(function(data) {
            //     weatherTemp = data.weather[0].icon;
            //     icon.push(weatherTemp);
            //     weatherTemp.toString();
            //     console.log(data);
            //     $(".city").html(`<h1>${ data.name }</h1>`);
            //     $(".humidity").html(`<p>Humidity: ${ data.main.humidity }</p>`);
            //     $(".windSpeed").html(`<p>Wind Speed: ${ data.wind.speed }</p>`);
            //     post = data;
            //     console.log(weatherTemp);
            //     return weatherTemp;
            // }).then(fetchImg(weatherTemp).then(function(data) {
            //     console.log(data)
            
            // })
            // );
            // console.log(weatherTemp);
            // fetchImg(weatherTemp).then(function(data){
            //     console.log(data);
            
            
            // });       
            var today, icon, uv, forecast;
            var img = new Image();
            var lat, long;

            fetch("http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=54ea5276d8943e943c85e5932fdd782a")
                .then(function (response) {
                    return response.json();
                }).then(function (data) {
                    weatherTemp = data.weather[0].icon
                    today = data;
                    return fetch("http://openweathermap.org/img/wn/" + weatherTemp + "@2x.png");
                }).then(function (response) {
                    return response;
                }).then(function (data) {
                    icon = data;
                    console.log(icon);
                    lat =  today.coord.lat;
                    long = today.coord.lon;
                    return fetch("http://api.openweathermap.org/data/2.5/uvi?appid=54ea5276d8943e943c85e5932fdd782a&lat=" + lat + "&lon=" + long)
                }).then(function (response) {
                    return response.json()
                }).then(function (data) {
                    uv = data;
                    return fetch("http://api.openweathermap.org/data/2.5/forecast?q=Seattle&appid=54ea5276d8943e943c85e5932fdd782a")
                }).then(function (response) {
                    return response.json()
                }).then (function (data) {
                    forecast = data;
                    console.log(today);
                    console.log(icon);
                    console.log(uv);
                    console.log(forecast);
                    var img = new Image();
                    img.src = "http://openweathermap.org/img/wn/01d@2x.png";
                    $(".city").html(`<h1>${ today.name } <img src=${ img.src } /></h1>`);
                }).catch(function (error) {
                    console.log(error);
                });  
                            
                            
                           
                            //$(".city").append('<img src=getpic />');
                            //$(".temperature").text((temp));
                            //$(".humidity").text((data.main.humidity));
                            //$(".windSpeed").text((data.wind.speed));
                           // $(".uvIndex").text((data.name));
                            //console.log(city);
        }

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

   
        // console.log("hello");
        // fetch("http://api.openweathermap.org/data/2.5/weather?q=Seattle&appid=54ea5276d8943e943c85e5932fdd782a")
        //     .then(
        //         function(response) {
        //             console.log(response);
                
        //             response.json().then(function(data) {
        //                 console.log(data);
                    
                    
        //                 console.log(city)
                    
                    
                    
        //             });
                    
        //         }
        //     )
            
    
    
