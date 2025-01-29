import './App.css';
import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  
  	const [data, setData] = useState(null);

	// OpenWeather
	const apiKey = "2a9cecea2c4fdfbc49ee7285c93580e6";
	//

	const [city, setCity] = useState("Lisbon"); 
	const [unit, setUnit] = useState("metric"); 
	const [weather, setWeather] = useState(null); 
	const [unitTemperature, setUnitTemperature] = useState("ºC"); 
	const [unitWind, setUnitWind] = useState("km/h"); 
	const [error, setError] = useState(""); 

	const changeUnits = (data) => {
		if (data == "metric") { 
			setUnitTemperature("ºC"); 
			setUnitWind("km/h");
		} else if (data == "imperial") { 
			setUnitTemperature("ºF");
			setUnitWind("mph");
		}
		if (!city) {
			fetchWeather();
		}
	}
		
	const generateNextDaysWeatherForecast = () => {
		if (!weather || !weather.list) {
			console.log("Weather is null!");
			return null;
		}
	
		const divs = [];
		for (let i = 1; i < weather.list.length; i++) {
			divs.push(
				<div className="card m-1 col-4" style={{width: '9rem'}}>
					<p className="card-text text-center">
						<span className="fw-bolder">{weather.list[i].dt_txt.substring(0,10)}</span>
						<br></br>
						<a>{weather.list[i].dt_txt.substring(10,16)}</a>
					</p>
					<img src={`https://openweathermap.org/img/wn/${weather.list[i].weather[0].icon}@4x.png`} style={{height: 'auto', width: '100px'}} className="card-img-top img-responsive center-block d-block mx-auto" alt="..."/>
					<div className="card-body">
						<p className="card-text text-center">{weather.list[i].weather[0].main}</p>
						<p className="card-text text-center">
							<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-arrow-up-circle me-2" viewBox="0 0 16 16">
								<path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 ß7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z"/>
							</svg> {weather.list[i].main.temp_max}{unitTemperature}
						</p>
						<p className="card-text text-center">
							<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-arrow-down-circle me-2" viewBox="0 0 16 16">
								<path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"/>
							</svg> {weather.list[i].main.temp_min}{unitTemperature}
						</p>
					</div>
				</div>
			);
		}
		return <div className="row flex-nowrap text-center overflow-x-scroll">{divs}</div>;
	}

	const fetchWeather = async () => {
		if (!city) {
		  setError("Please insert a city.");
		  return;
		}

		if (!unit) {
			setError("Please select a unit (metric or imperial).");
			return;
		}
	
		try {
		  setError(""); 
		  const response = await fetch(
			`https://api.openweathermap.org/data/2.5/forecast/?q=${city}&units=${unit}&appid=${apiKey}`
		  );
	
		  if (!response.ok) {
			throw new Error("City not found");
		  }
	
		  const data = await response.json();
		  setWeather(data); 
		} catch (err) {
		  setWeather(null);
		  setError(err.message); 
		}
	};

	return (
		<div class="">
			<div id="search" className="d-flex justify-content-md-center align-items-center m-3">
				
				<input type="text" value={city} onChange={(e) => setCity(e.target.value)} onKeyDown={(e) => {if (e.key === "Enter") fetchWeather()}} 
				placeholder="Enter a city" style={{width:"40%"}} className="form-control m-2"/>

				<div className="m-2" style={{width:"10%"}}>
					<select style={{width:"100%"}} className="custom-select form-control" id="inputUnits" onChange={(e) => {setUnit(e.target.value); changeUnits(e.target.value); }}>
						<option value="metric" selected>Metric</option>
						<option value="imperial">Imperial</option>
					</select>
				</div>
				
				<div className="m-2">
					<button type="button" className="btn btn-outline-dark" onClick={fetchWeather}>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
							<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
						</svg> Search
					</button>
				</div>

			</div>
		
			{error && 
				<div className="alert alert-danger center-block" style={{width:"100%"}} role="alert">
					{error}
				</div>
			}
			{weather && (
			<div id="result">
				{/* Today Forecast */}
				<div id = "resultToday" className="m-1 p-1 d-flex justify-content-md-center align-items-center">
					<div class="row border" style={{width: '65%'}} >
						<div class="col-md-8 ">
							<h1 className="display-5">{weather.city.name}</h1>
							<p className="lead" style={{fontSize:"12px"}}>{weather.city.coord.lat}, {weather.city.coord.lon} ({weather.city.country})</p>
							<div className="row">
								<div className="col-4">
									<p className="">
										<span className="fw-bolder">Max. temperature</span>
										<br></br>
										<a>{weather.list[0].main.temp_max}{unitTemperature}</a>
									</p>
								</div>
								<div className="col-4">
									<p className="">
										<span className="fw-bolder">Wind</span>
										<br></br>
										<a>{weather.list[0].wind.speed} {unitWind}</a>
									</p>
								</div>
								<div className="col-4">
									<p className="">
										<span className="fw-bolder">Pressure</span>
										<br></br>
										<a>{weather.list[0].main.pressure} hPa</a>
									</p>
								</div>
							</div>
							<div className="row">
								<div className="col-4">
									<p className="">
										<span className="fw-bolder">Min. temperature</span>
										<br></br>
										<a>{weather.list[0].main.temp_min}{unitTemperature}</a>
									</p>
								</div>
								<div className="col-4">
									<p className="">
										<span className="fw-bolder">Humidity</span>
										<br></br>
										<a>{weather.list[0].main.humidity}%</a>
									</p>
								</div>
								<div className="col-4">
									<p className="">
										<span className="fw-bolder">Visibility</span>
										<br></br>
										<a>{weather.list[0].visibility} km</a>
									</p>
								</div>
							</div>
						</div>
						<div class="col-md-4">
							<img className="img-responsive center-block d-block mx-auto" style={{height: "90px"}} src={`https://openweathermap.org/img/wn/04d@4x.png`}/>
							<p className="fs-1 text-center" style={{width:"100%"}}>{weather.list[0].main.temp}{unitTemperature}</p>
							<p className="fs-7 text-center" style={{width:"100%"}}>Feels like {weather.list[0].main.feels_like}{unitTemperature}</p>
							<p className="fs-5 text-center" style={{width:"100%"}}>Clouds{weather.list[0].weather.main}</p>
						</div>
					</div>
				</div>

				{/* Next Days Forecast */}
				<div id="resultNextDays" className="container" style={{width: '65%'}}>
					{weather ? generateNextDaysWeatherForecast() : null}
				</div>
			</div>					
			)}
		</div>
	  );
}

export default App;
