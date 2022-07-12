const btnSearch = document.getElementById("btn-search");
const searchInput = document.getElementById("search-input");
const daysForecast = document.getElementById("forecast");
const searchHistory = document.getElementById("history");
const btnClear = document.getElementById("clear-search");
const todayWeather = document.getElementById("today");

// Initialize searchArray to store searched city
var searchArray = [];
localStorage.setItem("searchArray", JSON.stringify(searchArray));

function fetchOpenWeather(){
    if(localStorage.getItem("search")){
        var city = localStorage.getItem("search");
    
        // Once a city is submitted, the city string is passed to a url link in order to search weather in the city
        var city_url = "https://api.openweathermap.org/data/2.5/weather?q="+ city + "&appid=0fd6b4fe383cc3d0cc48aa0476837f29";

        // Initialize latitude, longitude and a new api link in order for later usage
        var lat, lon;
        var onecall_url;
        
        // Fetch data from the url with city name
        fetch(city_url)
        .then(response => response.json())
        .then(function(data){
            // set up latitude and longitude of a given city for making new api call
            lat = data.coord.lat;
            lon = data.coord.lon;
            onecall_url= "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+ "&lon="+lon+"&appid=0fd6b4fe383cc3d0cc48aa0476837f29";
            
            var cityName = data.name;
            
            // fetch a new api call which contains all necessary information
            fetch(onecall_url)
            .then(response => response.json())
            .then(function(data){
                // Reset the div element which displays today's weather
                todayWeather.innerHTML=``;
                
                // Create elements and define today's current weather conditions into the elements
                var todayCity = document.createElement("h2");
                todayCity.setAttribute("style", "display: inline-block");
                var todayWeatherIcon = getWeatherIcon(data.current.weather[0].icon);
                todayWeatherIcon.setAttribute("style", "display: inline-block");
                todayCity.innerHTML = cityName + " (" + unixTimeConverter(data.current.dt) + ")  ";
                todayWeather.appendChild(todayCity);
                todayWeather.appendChild(todayWeatherIcon);

                var todayTemp = document.createElement("p");
                todayTemp.setAttribute("class", "detail");
                todayTemp.textContent = "Temp: " + kelvinToFahrenheit(data.current.temp)+'℉';
                todayWeather.appendChild(todayTemp);

                var todayWind = document.createElement("p");
                todayWind.setAttribute("class", "detail");
                todayWind.textContent = "Wind: " + meterToMile(data.current.wind_speed)+"MPH";
                todayWeather.appendChild(todayWind);

                var todayHumidity = document.createElement("p");
                todayHumidity.setAttribute("class", "detail");
                todayHumidity.textContent = "Humidity: " + data.current.humidity+"%";
                todayWeather.appendChild(todayHumidity);

                var todayUV = document.createElement("p");
                var todayUVIndication = document.createElement("span");
                todayUV.setAttribute("class", "detail");
                todayUV.setAttribute("style", "display: inline-block");
                todayUVIndication.setAttribute("class", `detail ${uvIndex(data.current.uvi)}`);
                todayUVIndication.innerText = data.current.uvi;
                todayUV.innerHTML = "UV Index: ";
                todayWeather.appendChild(todayUV);
                todayWeather.appendChild(todayUVIndication);

                // Lines below are designed for 5-days forecast
                daysForecast.innerHTML = ``;
                for (let i = 1; i < 6; i++){
                        var cardDiv = document.createElement("div");
                        cardDiv.setAttribute("class", "card");
                        cardDiv.setAttribute("style", "width: 14rem;");
                        var cardBody = document.createElement("div");
                        cardBody.setAttribute("class", "card-body");
                        cardDiv.appendChild(cardBody);
            
                        var title = document.createElement("h5");
                        title.setAttribute("class", "card-title");
                        title.textContent = unixTimeConverter(data.daily[i].dt);
                        cardBody.appendChild(title);

                        var icon = getWeatherIcon(data.daily[i].weather[0].icon);
                        cardBody.appendChild(icon);

                        var temp = document.createElement("h6");
                        temp.textContent = "Temp: " + kelvinToFahrenheit(data.daily[i].temp.day)+'℉';
                        cardBody.appendChild(temp);

                        var wind = document.createElement("h6");
                        wind.textContent = "Wind: " + meterToMile(data.daily[i].wind_speed)+"MPH";
                        cardBody.appendChild(wind);

                        var humidity = document.createElement("h6");
                        humidity.textContent = "Humidity: " + data.daily[i].humidity+"%";
                        cardBody.appendChild(humidity);


                        daysForecast.appendChild(cardDiv);

                    }
                })

        });


        iterateSearch();

    }

}

// Set up addEventListener to receive a city string from user input
btnSearch.addEventListener("click", function(e){
    e.preventDefault();
    localStorage.setItem("search", searchInput.value);
    if(!searchArray){
        var searchArray = [];
    }

    searchArray = JSON.parse(localStorage.getItem("searchArray"));

    searchArray.push(searchInput.value);
    localStorage.setItem("searchArray", JSON.stringify(searchArray));
    JSON.parse(localStorage.getItem("searchArray"));

    fetchOpenWeather();
});


// Clear search history if user clicks this button
btnClear.addEventListener("click", function(e){
    e.preventDefault();
    
    clearSearchHistory();
})

// Convert Unix time to date
function unixTimeConverter(dt){
    var unixTime = new Date (dt*1000);
    var dateString = unixTime.toLocaleDateString();

    return dateString;
}

// Convert Kelvin degree to Fahrenheit degree
function kelvinToFahrenheit(kelvin){
    var fahrenheit = ((kelvin-273.15)*1.8)+ 32;

    return fahrenheit.toFixed(2);
}

// With iconCode passed to this function, create and return an img element sourcing the icon image
function getWeatherIcon(iconCode){
    var img = document.createElement("img");
    img.setAttribute("src", "http://openweathermap.org/img/wn/" +iconCode+ ".png");

    return img;
}

// With given uv index, it returns corresponding class name depending on how serious the uv index is.
function uvIndex(uv){
    if(uv < 2.5){
        return "favorable";
    } else if (uv < 7.5){
        return "moderate";
    } else {
        return "severe";
    }
}

// Convert meter per sec to mile per hour
function meterToMile(meter){
    return (meter*2.23694).toFixed(2);
}

// Clear search history visually on html and remove searchArray in the local storage.
function clearSearchHistory(){
    var array = [];
    localStorage.setItem("searchArray", JSON.stringify(array));
    searchHistory.innerHTML = ``;
}

// Iterage search history array and return button elements for each search history in local storage.
// Also set up the button to have onclick function and id, which is name of the searched city.
function iterateSearch(){
    var array = JSON.parse(localStorage.getItem("searchArray"));

    searchHistory.innerHTML = ``;

    for (let i=0; i< array.length; i++){
        var newCity = document.createElement("button");
        newCity.setAttribute("class", "btn btn-block past");
        newCity.setAttribute("onclick", "historyOnclick()");
        newCity.setAttribute("id", `${array[i]}`);
        newCity.innerText = array[i];
        searchHistory.append(newCity);
    }

}

// If the history button is clicked, it responds with searching for a weather from the given city
function historyOnclick(){
    localStorage.setItem("search", event.target.id);

    fetchOpenWeather();
}