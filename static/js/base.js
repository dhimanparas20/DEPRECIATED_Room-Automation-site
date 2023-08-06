//Global Variable Declaration
var switches = document.querySelectorAll(".switch input");
var message = document.getElementById("message");
var pins = ["V1", "V2", "V3", "V4"];
var previousResponse;
var previousstate;
var timeout = 10000
var trgr = true;

// Retrieve the token and user value from the data attribute
var token_element = document.getElementById('token-container');
var user_element = document.getElementById('user-container');
//var pinStats_element = document.getElementById('pinStats-container');

var token = token_element.dataset.token;
var user = user_element.dataset.user;
//var pinStats = pinStats_element.dataset.pinstats;
//console.log(pinStats);


//var stats_element = document.getElementById('stats-container');
//var stats = JSON.parse(stats_element.dataset.status);

//console.log(stats.PIN1); // Output: "E"


`use strict`;
//Displays Time
function refreshTime() {
  const timeDisplay = document.getElementById("time");
  const dateString = new Date().toLocaleString();
  const formattedString = dateString.replace(", ", " - ");
  timeDisplay.textContent = formattedString;
}
setInterval(refreshTime, 1000);

// Function that auto runs after specfic interval of time
async function handlePageReload() {
  //if (!isResponseEqual(navigator.onLine, previousResponse)) {
    if (navigator.onLine){
      if (!trgr){
        message.innerHTML = "Connected"+" ("+user+")";
        message.style.color = "#21ed58";
        }

      document.getElementById("switch1").disabled = false;
      document.getElementById("switch2").disabled = false;
      document.getElementById("switch3").disabled = false;
      document.getElementById("switch4").disabled = false;

      //When light comes back, bring back old state
      if (trgr === true) {
        message.innerHTML = "Restoring States..";
        message.style.color = "#d0eb34";
        await sleep(timeout);
        var response = await trigger2();
        trigger(response.V1, "V1");
        trigger(response.V2, "V2");
        trigger(response.V3, "V3");
        trigger(response.V4, "V4");
        trgr = false;
        message.innerHTML = "Connected"+" ("+user+")";
        message.style.color = "#21ed58";
      }

      // Applies any changes done on the states
      var response = await trigger2();
      if (!isResponseEqual(response, previousResponse)) {
        for (var i = 0; i < pins.length; i++) {
          var pin = pins[i];
          switch (pin) {
            case "V1":
              await updateElement(response, pin, "switch1");
              break;
            case "V2":
              await updateElement(response, pin, "switch2");
              break;
            case "V3":
              await updateElement(response, pin, "switch3");
              break;
            case "V4":
              await updateElement(response, pin, "switch4");
              break;
            default:
              return;
          }
        }
        previousResponse = response; // Update previous response
      }
    }
    else if (!navigator.onLine){
      //console.log("Offline ");
      //console.log(v1state,v2state,v3state,v4state);
      trgr=true;
      message.innerHTML = "Disonnected";
      message.style.color = "red";
      document.getElementById("switch1").disabled = true;
      document.getElementById("switch2").disabled = true;
      document.getElementById("switch3").disabled = true;
      document.getElementById("switch4").disabled = true;
    }
   // previousResponse = navigator.onLine;
  //}
}
setInterval(handlePageReload, 700);

async function trigger(value, pin) {
  try {
    await fetch(`https://blr1.blynk.cloud/external/api/update?token=${token}&${pin}=${value}`);
    //console.log('API call successful');
  } catch (error) {
    console.error('Error:', error);
  }
}

async function trigger2() {
  try {
    var response = await fetch(`https://blr1.blynk.cloud/external/api/get?token=${token}&V1&V2&V3&V4`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    var jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    console.error('Error:', error);
  }
}



function isResponseEqual(response1, response2) {
  // Return true if responses are equal, false otherwise
  return JSON.stringify(response1) === JSON.stringify(response2);
}


function handleSwitchChange(event) {
  var switchElement = event.target;
  var switchLabelElement = switchElement.closest(".switch-container").querySelector(".switch-label");
    if (switchLabelElement && navigator.onLine ) {
      //var switchLabel = switchLabelElement.textContent;
      var switchName = switchElement.id;
      var pin = getpin(switchName);

      if (switchElement.checked) {
        //console.log("ON: " + switchLabel + " : " + switchName + " : " + pin);
        trigger(1,pin);
      } else {
        //console.log("OFF: " + switchLabel + " : " + switchName + " : " + pin);
        trigger(0,pin)
      }
    }
  }

switches.forEach(function(switchElement) {
  switchElement.addEventListener("change", handleSwitchChange);
});

function getpin(switchName){
  var pin;
  switch (switchName){
    case "switch1":
      pin = "V1";
      break;
    case "switch2":
      pin = "V2";
      break;
    case "switch3":
      pin = "V3";
      break;
    case "switch4":
      pin = "V4";
      break;
    default:
      return; // Exit function if pin is not recognized
  }
  return pin;
}
//handlePageReload();
//window.addEventListener("beforeunload", handlePageReload);


async function updateElement(response, pin, elementId) {
  var x = document.getElementById(elementId);
  var state = response[pin] === 1 ? 1 : 0;

  if (state === 1) {
    x.checked = true;
  } else {
    x.checked = false;
  }
  return state;
}

// Delay/Sleep Function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
