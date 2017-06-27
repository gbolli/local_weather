$(document).ready(function() {
  
  // create variables

  var APIKey = "";  // enter your Dark Sky API key here.
  var lat;
  var long;

  var isCelcius = true;
  var degSym = " &degC";

  var currentDay;
  var forecastDays = [];

  var currentTemp;
  var currentIcon;

  var forecastTemp = [];
  var forecastIcon = [];

  // weekday array

  var weekday = new Array(7);
  weekday[0] = "Sun: ";
  weekday[1] = "Mon: ";
  weekday[2] = "Tue: ";
  weekday[3] = "Wed: ";
  weekday[4] = "Thu: ";
  weekday[5] = "Fri: ";
  weekday[6] = "Sat: ";

  // background images array
  
  var backgroundImageUrl = new Array();
  backgroundImageUrl[0] = "url(http://i.imgur.com/QPANLwH.jpg)"; //sunny
  backgroundImageUrl[1] = "url(http://i.imgur.com/4IVXdtW.jpg)"; //cloudy
  backgroundImageUrl[2] = "url(http://i.imgur.com/jYTSM4b.jpg)"; //rainy
  backgroundImageUrl[3] = "url(http://i.imgur.com/GGQhXG4.jpg)"; //snowy
  backgroundImageUrl[4] = "url(http://i.imgur.com/F2cVzRk.jpg)"; //windy
  backgroundImageUrl[5] = "url(http://i.imgur.com/Dp3fc8h.jpg)"; //foggy
  backgroundImageUrl[6] = "url(http://i.imgur.com/h1teC5x.jpg)"; //clear eve
  backgroundImageUrl[7] = "url(http://i.imgur.com/1prs047.jpg)"; //cloudy eve

  // get date
  
  var d = new Date();
  currentDay = d.getDay();

  // get day of week

  function getWeekday(day) {
    return weekday[day];
  }

  // set forecast days

  for (var i = 1; i < 8; i++) {
    forecastDays[i] = getWeekday((currentDay + i) % 7);
  };

  // find location

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setCoords);
    } else {
    $("#errorMsg").html("Geolocation is not supported by this browser.");
  }

  function setCoords(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;

    // run after location acquired
    getWeather();
  }

  // get background image (switch statement)
  // case:  thunderstorm  $("body").css("background","url('https://upload.wikimedia.org/wikipedia/commons/0/0c/Rooymans2000_-_Morning_Lightning_Strike_in_Singapore_(by).jpg')");
  function backgroundCSS(icon) {
    $("body").css({"background":backgroundImageUrl[icon],"background-size": "cover","background-repeat":"no-repeat"});
  }

  function setBackground(icon) {
    switch (icon) {
      case "clear-day":
        backgroundCSS(0);
        break;
      case "clear-night":
        backgroundCSS(6);
        break;
      case "rain":
        backgroundCSS(2);
        break;
      case "snow":
        backgroundCSS(3);
        break;
      case "sleet":
        backgroundCSS(3);
        break;
      case "wind":
        backgroundCSS(4);
        break;
      case "fog":
        backgroundCSS(5);
        break;
      case "cloudy":
        backgroundCSS(1);
        break;
      case "partly-cloudy-day":
        backgroundCSS(1);
        break;
      case "partly-cloudy-night":
        backgroundCSS(7);
        break;
      default:
        backgroundCSS(4);
    }
  }

  // get icons (switch statement)

  function getIcon(icon) {
    switch (icon) {
      case "clear-day":
        return '<i class="wi wi-day-sunny" aria-hidden="true">';
        break;
      case "clear-night":
        return '<i class="wi wi-night-clear" aria-hidden="true">';
        break;
      case "rain":
        return '<i class="wi wi-rain" aria-hidden="true">';
        break;
      case "snow":
        return '<i class="wi wi-snow" aria-hidden="true">';
        break;
      case "sleet":
        return '<i class="wi wi-sleet" aria-hidden="true">';
        break;
      case "wind":
        return '<i class="wi wi-cloudy-gusts" aria-hidden="true">';
        break;
      case "fog":
        return '<i class="wi wi-fog" aria-hidden="true">';
        break;
      case "cloudy":
        return '<i class="wi wi-cloud" aria-hidden="true">';
        break;
      case "partly-cloudy-day":
        return '<i class="wi wi-day-cloudy" aria-hidden="true">';
        break;
      case "partly-cloudy-night":
        return '<i class="wi wi-night-partly-cloudy" aria-hidden="true">';
        break;
      default:
        return '<i class="wi wi-storm-showers" aria-hidden="true">';
    }
  }

  // remove focus from button after clicking

  $(".btn").mouseup(function(){
    $(this).blur();
  })
  
  // button to convert to/from celcius/farenheit

  $("#convert").on("click", function() {
      isCelcius = (isCelcius ? false : true);
      degSym = (degSym === " &degC" ? " &degF" : " &degC");
      updateTemp();
    });

  // function to convert temp

  function getTemp(temp) {
    temp = (isCelcius ? Math.round((temp-32)/1.8) : Math.round(temp));
    return temp;
  }

  // function to update temp in html

  function updateTemp() {
    for (var i = 1; i < 8; i++) {
      $("#tempFC"+i).html(forecastDays[i] + getTemp(forecastTemp[i]));
    }
    $("#tempC").html(getTemp(currentTemp) + degSym);
  }

  // get weather from Dark Sky API

  function getWeather() { 
        var APIUrl = "https://crossorigin.me/https://api.darksky.net/forecast/" + APIKey +"/" + lat + "," + long;
        $.ajax({
          type: 'GET',
          dataType: 'json',
          url: APIUrl,  // Dark Sky API URL
          //json: "callback",
          //data: {},
          
          success: function (data) {
            
            console.log(data);   //  for testing

            // set current temp, summary, icon

            currentTemp = data.currently.apparentTemperature;
            currentSummary = data.currently.summary;
            currentIcon = data.currently.icon;

            $("#tempC").html(getTemp(currentTemp) + degSym);
            $("#summary").html(currentSummary);
            $("#iconC").html(getIcon(currentIcon));
            setBackground(currentIcon);

            // set forecast temp, icons

            for (var i = 0; i < 8; i++) {
              forecastTemp[i] = data.daily.data[i].apparentTemperatureMax;
              $("#tempFC"+i).html(forecastDays[i] + getTemp(data.daily.data[i].apparentTemperatureMax));
              forecastIcon[i] = data.daily.data[i].icon;
              $("#iconFC"+i).html(getIcon(data.daily.data[i].icon));
            };
              
            }
        });  
  };
});