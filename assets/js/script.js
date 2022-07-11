const btnSearch = document.getElementById("btn-search");
const searchInput = document.getElementById("search-input");
const daysForecast = document.getElementById("forecast");

function fetchOpenWeather(){
    if(localStorage.getItem("search")){
        var city = localStorage.getItem("search");
        
        var city_url = "https://api.openweathermap.org/data/2.5/weather?q="+ city + "&appid=0fd6b4fe383cc3d0cc48aa0476837f29";
        var forecast_url = "https://api.openweathermap.org/data/2.5/forecast?q="+ city + "&appid=0fd6b4fe383cc3d0cc48aa0476837f29";
        var lat, lon;
        var onecall_url;
        // var onecall_url = "https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid=0fd6b4fe383cc3d0cc48aa0476837f29";

        fetch(city_url)
        .then(response => response.json())
        .then(function(data){
            lat = data.coord.lat;
            lon = data.coord.lon;
            onecall_url= "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+ "&lon="+lon+"&appid=0fd6b4fe383cc3d0cc48aa0476837f29";
            
            fetch(onecall_url)
                .then(response => response.json())
                .then(function(data){
                    console.log(data);
                    for (let i = 0; i < 5; i++){
                        console.log(unixTimeConverter(data.daily[i].dt));
                        console.log(getWeatherIcon(data.daily[i].weather[0].icon));
                        console.log(kelvinToFahrenheit(data.daily[i].temp.day)+'℉');
                        console.log(meterToMile(data.daily[i].wind_speed)+"mph");
                        console.log(data.daily[i].humidity+"%");
                    }
                })

            console.log(data);
            // console.log(data.name);
            // console.log(data.main.humidity); // unit should %
            // console.log(unixTimeConverter(data.dt)); 
            // console.log(getWeatherIcon(data.weather[0].icon));
            // // var iconCode = data.weather[0].icon;
            // // var img = document.createElement("img");
            // // img.setAttribute("src", "http://openweathermap.org/img/wn/" +iconCode+ "@2x.png");
            // // console.log(img); // icon img
            // console.log(kelvinToFahrenheit(data.main.temp)); //temp
        });


        fetch(forecast_url)
        .then(response => response.json())
        .then(function(data){
            console.log(data);
        });

    }

}


btnSearch.addEventListener("click", function(e){
    e.preventDefault();
    localStorage.setItem("search", searchInput.value);
    fetchOpenWeather();
});

function unixTimeConverter(dt){
    var unixTime = new Date (dt*1000);
    var dateString = unixTime.toLocaleDateString();

    return dateString;
}

function kelvinToFahrenheit(kelvin){
    var fahrenheit = ((kelvin-273.15)*1.8)+ 32;

    return fahrenheit.toFixed(2);
}

function getWeatherIcon(iconCode){
    var img = document.createElement("img");
    img.setAttribute("src", "http://openweathermap.org/img/wn/" +iconCode+ "@2x.png");

    return img;
}

function uvIndex(uv){
    if(uv < 2.5){
        return "favorable";
    } else if (uv < 7.5){
        return "moderate";
    } else {
        return "severe";
    }
}

function meterToMile(meter){
    return (meter*2.23694).toFixed(2);
}

unixTimeConverter();

fetchOpenWeather();