
fetch("http://api.openweathermap.org/data/2.5/weather?q=Seattle&appid=54ea5276d8943e943c85e5932fdd782a")
    .then(
        function(response) {
            console.log(response);
        
            response.json().then(function(data) {
                console.log(data);
            });
        }
    )
