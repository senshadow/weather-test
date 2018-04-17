/* code that runs when Web page is first loaded and rendered by the browser */
index = 0;
init();
window.onresize = function() {init()};

/* called when button is pushed */
function getNewPlace() {
	// get what the user put into the textbox
	var newPlace = document.getElementById("zipBox").value;

	// make a new script element
	var script = document.createElement('script');

	// start making the complicated URL
	script.src = "https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='"+newPlace+"')&format=json&callback=callbackFunction"

	script.id = "jsonpCall";

	// remove old script
	var oldScript = document.getElementById("jsonpCall");
	if (oldScript != null) {
		document.body.removeChild(oldScript);
	}

	// put new script into DOM at bottom of body
	document.body.appendChild(script);
}

/* called when new weather arrives */

function callbackFunction(data) {
	// parse the JSON string
	var weatherJSON = JSON.stringify(data);
	var weatherObj = JSON.parse(weatherJSON);

	// Check for errors, show pop-up, and return early
	if (weatherObj.hasOwnProperty("error")){
		// Probably empty string
		alert(weatherObj.error.description);
		return;
	} else if (weatherObj.query.results === null) {
		// location not found
		alert("Invalid Input.");
		return;
	}

	// Put various objects into variables
	forecastArray = weatherObj.query.results.channel.item.forecast;

	setCurrent(weatherObj);
	setForecast(forecastArray);
	index = 0;
	init();

}

// Set up current conditions
function setCurrent(weatherObj){
	// Put various objects into variables
	locationObj = weatherObj.query.results.channel.location;
	conditionObj = weatherObj.query.results.channel.item.condition;
	windObj = weatherObj.query.results.channel.wind;
	atmObj = weatherObj.query.results.channel.atmosphere;
	dateString = conditionObj.date.slice(0,-3);
	dateObj = new Date(dateString);

	var location = locationObj.city+ "," + locationObj.region;
	date = formatDate(dateObj);
	time = formatTime(dateObj);

	currLoc = document.getElementById("location");
	currLoc.textContent = location;
	currTime = document.getElementById("time");
	currTime.textContent = "Today " + time;
	currDate = document.getElementById("date");
	currDate.textContent = date;
	currTemp = document.getElementById("temp");
	currTemp.innerHTML = conditionObj.temp + "&#xb0;<span>F</span>";
	currCond = document.getElementById("condition");
	currCond.textContent = conditionObj.text.toLowerCase();
	currHumid = document.getElementById("humidity");
	currHumid.textContent = atmObj.humidity + "%";
	currWind = document.getElementById("wind");
	currWind.textContent = windObj.speed + "mph";

	var imgTag = getIcon(parseInt(conditionObj.code));
	currIcon = document.getElementById("left");
	currIcon.innerHTML = imgTag;
}

// Set up the 10 day forecast
function setForecast(forecastArray){
	fc = document.getElementsByClassName("forecast");

	for (i = 0; i< 10; i++){
		setDay(forecastArray[i], fc[i].children);
	}

}

function setDay(dayCond, day){
	day[0].textContent = dayCond.day;
	day[1].innerHTML = getIcon(parseInt(dayCond.code));
	day[2].textContent = dayCond.text.toLowerCase();
	day[3].children[0].innerHTML = dayCond.high + "&#xb0;";
	day[3].children[1].innerHTML = dayCond.low + "&#xb0;";
}

// Return an img tag based on weather code
// Code needs to be a number and not a string
function getIcon(code){
	var weatherIcon;
	var alt;
	var tagStart = '<img src="../WeatherApp 3/';
	var tagMid = '" alt="';
	var tagEnd = '" class="icon">';
	var thunder = [3,4,37,38,39,45,47];
	var rain = [8,9,10,11,12,35,40];
	var snow = [13,14,15,16,41,42,43,46];
	var cloud = [26,27,28,29];
	var partSun = [30,44];
	sunny = [32,34,36];

	if (thunder.includes(code)){
		weatherIcon = "thunder.png";
		alt = "thunder";
	}else if (rain.includes(code)){
		weatherIcon = "rain.png";
		alt = "rain";
	}else if (snow.includes(code)){
		weatherIcon = "snow.png";
		alt = "snow";
	}else if (cloud.includes(code)){
		weatherIcon = "cloudy.png";
		alt = "cloudy";
	}else if(partSun.includes(code)){
		weatherIcon = "part-sun.png";
		alt = "partly sunny";
	}else if (sunny.includes(code)){
		weatherIcon = "sunny.png";
		alt = "sunny";
	}else{
		weatherIcon = "";
		alt = "no image";
	}

	return tagStart + weatherIcon + tagMid + alt + tagEnd;

}

// format the date: Month day, year
function formatDate(date){
	// Create an array of Month names
	var months = ["January", "February", "March", "April", "May", "June", "July",
								"August", "September", "October", "November", "December"];

	// Create variables to hold parts of date
	var month = months[date.getMonth()];
	var day = date.getDate();
	var year = date.getFullYear();

	// Return the formatted string
	return month + " " + day + ", " + year;
}

// format the time like 2:15pm
function formatTime(date){
	var timeString = date.toLocaleTimeString().toLowerCase();
	var index = timeString.lastIndexOf(':');
	// Remove seconds and whitespace
	return timeString.slice(0,index) + timeString.slice(index+4);
}


function init(){
	steppy = document.getElementsByClassName("stepper")[0];
	var container = steppy.parentElement;
	var width = container.clientWidth;
	var cards = 200*5;
	var space = (width-cards)/4;
	var fc = steppy.children;

	var n = fc.length;

	var newPos = (index)*(200+space);

	if (width < 900){
		steppy.style.left = 0 + "px";
		return;
	}else{
		steppy.style.left = -newPos+"px";
	}

	for (i = 0; i < n; i++){
		fc[i].style.marginRight = space + "px";
	}
}

function nextFC() {
	steppy = document.getElementsByClassName("stepper")[0];
	var container = steppy.parentElement;
	var width = container.clientWidth;
	var cards = 200*5;
	var space = (width-cards)/4;
	var newPos;

	if (index < 5){
		index++;
		newPos = (index)*(200+space);
		steppy.style.left = -newPos+"px";
	}
}

function prevFC() {
	steppy = document.getElementsByClassName("stepper")[0];
	var container = steppy.parentElement;
	var width = container.clientWidth;
	var cards = 200*5;
	var space = (width-cards)/4;
	var newPos;

	if (index > 0){
		index--;
		newPos = (index)*(200+space);
		steppy.style.left = -newPos+"px";
	}
}
