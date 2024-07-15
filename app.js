document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "H1k61HYXjJvaxty5QveIcAewEnflgAOZ";
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("currentWeather");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    function fetchWeatherData(locationKey) {
        fetchDailyForecast(locationKey);

        const url = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching weather data.</p>`;
            });
    }

    function displayWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const icon = data.WeatherIcon;
        const weatherContent = `
            <div class="row">
                <div class="col-lg-6 d-flex justify-content-end">
                    <img src="icons/${icon}.svg">
                </div>
                <div class="col-lg-6">
                    <h2>Weather</h2>
                    <p>Temperature: ${temperature}°C</p>
                    <p>Weather: ${weather}</p>
                </div>
            </div>
        `;
        weatherDiv.innerHTML = weatherContent;
    }

    function fetchDailyForecast(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&metric=true`;
    
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const dailyForecastDiv = document.getElementById("dailyForecast");
                
                data.DailyForecasts.forEach(forecast => {
                    const date = new Date(forecast.Date);
                    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
                    const maxTemp = forecast.Temperature.Maximum.Value;
                    const minTemp = forecast.Temperature.Minimum.Value;
                    const dayWeather = forecast.Day.IconPhrase;
                    const dayIcon = forecast.Day.Icon;
                    const nightWeather = forecast.Night.IconPhrase;
                    const nightIcon = forecast.Night.Icon;
                    
                    const card = document.createElement('div');
                    card.classList.add('forecast-card');
                    card.innerHTML = `
                        <h3>${day}</h3>
                        <p>Max: ${maxTemp}°C</p>
                        <p>Min: ${minTemp}°C</p>
                        <p>Day: ${dayWeather} <img src="icons/${dayIcon}.svg" width="10%"></p>
                        <p>Night: ${nightWeather} <img src="icons/${nightIcon}.svg" width="10%"></p>
                    `;
                    dailyForecastDiv.appendChild(card);
                });
            })
            .catch(error => {
                console.error("Error fetching daily forecast:", error);
                const dailyForecastDiv = document.getElementById("dailyForecast");
                dailyForecastDiv.innerHTML = `<p>Error fetching daily forecast.</p>`;
            });
    }
});
