const btnSearch = document.getElementById("btn-search");
const searchInput = document.getElementById("search-input");

function fetchOpenWeather(){
    if(localStorage.getItem("search")){
        var city = localStorage.getItem("search");
        
        var city_url = "https://api.openweathermap.org/data/2.5/weather?q="+ city + "&appid=0fd6b4fe383cc3d0cc48aa0476837f29";
        var forecast_url = "https://api.openweathermap.org/data/2.5/forecast?q="+ city + "&appid=0fd6b4fe383cc3d0cc48aa0476837f29";

        fetch(city_url)
        .then(response => response.json())
        .then(function(data){
            console.log(data);
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

fetchOpenWeather();