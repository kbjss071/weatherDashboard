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
            console.log(data.name);
            console.log(data.main.humidity); // unit should %
            console.log(moment(data.dt).format("l"));
            var unixTime = new Date (data.dt*1000);
            console.log(data.dt*1000)

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

function unixTimeConverter(){
    var unixTime = new Date (1657362860*1000);
    var month = unixTime.getMonth();
    var date = unixTime.getDate();
    var year = unixTime.getFullYear();
    var string = unixTime.getTime();
    console.log(month);
    console.log(date);
    console.log(year);
    console.log(string);
}

unixTimeConverter();

fetchOpenWeather();