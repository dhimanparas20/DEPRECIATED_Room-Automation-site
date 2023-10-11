//Global Variable Declaration
var switches = document.querySelectorAll(".switch input");
var message = document.getElementById("message");
var pins = ["V1", "V2", "V3", "V4"];
var previousResponse;
var previousstate;
var trgr = true;
let  token = jsonData["token"];
let user = jsonData["username"];
let timeout = jsonData["restoreTime"];
var backgroundImageUrl = "url(" + jsonData["wallUrl"] + ")";
var refreshtimeout = 5000;
var isOnine=true;

// Changes userspecified Walls
var body = document.body;
body.style.backgroundImage = backgroundImageUrl;

//Disables the Undefined Buttons
for (var i = 0; i < 4; i++) {
  var pin = "PIN" + (i + 1);
  if (jsonData["device"][i]["state"] === "D") {
    var switchInput = document.getElementById("switch" + (i + 1));
    var switchLabel = document.querySelector('label[for="switch' + (i + 1) + '"]');
    var sliderSpan = switchInput.nextElementSibling; // Assuming the slider is a sibling of the input
    switchInput.disabled = true; // Disable the slider input
    sliderSpan.style.pointerEvents = "none"; // Disable pointer events on the slider span
    sliderSpan.style.backgroundColor = "#ccc"; // Set a disabled background color
    sliderSpan.style.opacity = "0.5"; // Reduce opacity to indicate it's disabled
    switchLabel.textContent = "Disabled"; // Update the label text
  }
}

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
      isConnected();
      if(isOnine){
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
      }else{
        trgr=true;
        message.innerHTML = "Board OFFLINE";
        message.style.color = "orange";
        document.getElementById("switch1").disabled = true;
        document.getElementById("switch2").disabled = true;
        document.getElementById("switch3").disabled = true;
        document.getElementById("switch4").disabled = true;
      }
    }

    else if (!navigator.onLine){
      trgr=true;
      message.innerHTML = "No Internet";
      message.style.color = "red";
      document.getElementById("switch1").disabled = true;
      document.getElementById("switch2").disabled = true;
      document.getElementById("switch3").disabled = true;
      document.getElementById("switch4").disabled = true;
    }
}
setInterval(handlePageReload, refreshtimeout);

async function trigger(value, pin) {
  try {
    await fetch(`https://blr1.blynk.cloud/external/api/update?token=${token}&${pin}=${value}`);
    //console.log('API call successful');
  } catch (error) {
    console.error('Error:', error);
  }
}  
  
async function isConnected() {
  try {
    var response = await fetch(`https://blr1.blynk.cloud/external/api/isHardwareConnected?token=${token}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    var jsonResponse = await response.json();
    //console.log(jsonResponse)
    isOnine =  jsonResponse;
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
