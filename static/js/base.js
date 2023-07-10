`use strict`;
//Displays Time
function refreshTime() {
  const timeDisplay = document.getElementById("time");
  const dateString = new Date().toLocaleString();
  const formattedString = dateString.replace(", ", " - ");
  timeDisplay.textContent = formattedString;
}
setInterval(refreshTime, 1000);


function trigger(value, pin) {
  fetch(`https://blr1.blynk.cloud/external/api/update?token=g2-VR83SfRVfmPIMoTQLX0nCrWbJQ9kA&${pin}=${value}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      //console.log('API call successful');
    })
    .catch(error => {
      // Error handling: Log or handle the error as needed
      console.error('Error:', error);
    });
}

function trigger2() {
  var xhReq = new XMLHttpRequest();
  xhReq.open("GET", `https://blr1.blynk.cloud/external/api/get?token=g2-VR83SfRVfmPIMoTQLX0nCrWbJQ9kA&V1&V2&V3&V4`, false);
  xhReq.send(null);

  if (xhReq.readyState === 4 && xhReq.status === 200) {
    var jsonResponse = JSON.parse(xhReq.responseText);
    return jsonResponse;
  }
}


//Global Variable Declaration
var pins = ["V1", "V2", "V3", "V4"];
var previousResponse;
var previousstate;
var trgr = false;
var v1state;
var v2state;
var v3state;
var v4state;

function isResponseEqual(response1, response2) {
  // Return true if responses are equal, false otherwise
  return JSON.stringify(response1) === JSON.stringify(response2);
}

//================================================
//NEW CODE
//================================================
var switches = document.querySelectorAll(".switch input");

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

// Function that auto runs after specfic interval of time
function handlePageReload() {
  if (navigator.onLine){
    var message = document.getElementById("message");
    message.innerHTML = "Connected";
    message.style.color = "greenyellow";

    document.getElementById("switch1").disabled = false;
    document.getElementById("switch2").disabled = false;
    document.getElementById("switch3").disabled = false;
    document.getElementById("switch4").disabled = false;

    //When light comes back bring back old state
    if (trgr===true){
      //console.log("Trigger called======================================");
      var response =  trigger2();
      v1state = response.V1;
      v2state = response.V2;
      v3state = response.V3;
      v4state = response.V4;
      //console.log("Delay function activated;");
      setTimeout(delayedFunction, 10000);
      function delayedFunction() {
        //console.log("Delay function Finished;");
        trigger(v1state,"V1");
        trigger(v2state,"V2");
        trigger(v3state,"V3");
        trigger(v4state,"V4");
      }
      trgr=false;
      return;
    }
    response = trigger2();
    if (!isResponseEqual(response, previousResponse)) {
      for (var i = 0; i < pins.length; i++) {
        var pin = pins[i];
        switch (pin) {
          case "V1":
            updateElement(response, pin, "switch1");
            break;
          case "V2":
            updateElement(response, pin, "switch2");
            break;
          case "V3":
            updateElement(response, pin, "switch3");
            break;
          case "V4":
            updateElement(response, pin, "switch4");
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
    var message = document.getElementById("message");
    message.innerHTML = "Disonnected";
    message.style.color = "red";
    document.getElementById("switch1").disabled = true;
    document.getElementById("switch2").disabled = true;
    document.getElementById("switch3").disabled = true;
    document.getElementById("switch4").disabled = true;
  }
}

setInterval(handlePageReload, 500);
//handlePageReload();
//window.addEventListener("beforeunload", handlePageReload);


function updateElement(response, pin, elementId) {
  var x = document.getElementById(elementId);
  var state = response[pin] === 1 ? 1 : 0;

  if (state === 1) {
    x.checked = true;
    x.backgroundColor = "red";
    x.color = "red";
  } else {
    x.checked = false;
  }
  return state;
}






/*

function getvalue() {
  //console.log(trgr);
  var online = navigator.onLine;
  if (online){
    //console.log("online");
    $.ajax({
      url: "/getval",
      method: "GET",
      dataType: "json",
      success: function(response){
        //console.log(response,trgr);
        if(response.state==true){
          var message = document.getElementById("message");
          message.innerHTML = "Connected";
          message.style.color = "greenyellow";

          //When light comes back bring back old state
          if (trgr===true){
            //console.log("Trigger called======================================");
            //console.log(v1state,v2state,v3state,v4state);
            trigger(v1state,"V1");
            trigger(v2state,"V2");
            trigger(v3state,"V3");
            trigger(v4state,"V4");
            getcolor(v1state,"V1");
            getcolor(v2state,"V2");
            getcolor(v3state,"V3");
            getcolor(v4state,"V4");
            trgr=false;
            return;
          }

          function updateElement(response, pin, elementId) {
            var x = document.getElementById(elementId);
            var color = document.getElementById("color" + pin);
            var state = response[pin] === 1 ? 1 : 0;

            if (state === 1) {
              x.innerHTML = "ON";
              color.style.backgroundColor = "red";
            } else {
              x.innerHTML = "OFF";
              color.style.backgroundColor = "#26a9e0";
            }
            return state;
          }

          if (!isResponseEqual(response, previousResponse)) {
            var pins = ["V1", "V2", "V3", "V4"];
            for (var i = 0; i < pins.length; i++) {
              var pin = pins[i];
              var elementId = "myDIV" + i;
              switch (pin) {
                case "V1":
                  v1state = updateElement(response, pin, elementId);
                  break;
                case "V2":
                  v2state = updateElement(response, pin, elementId);
                  break;
                case "V3":
                  v3state = updateElement(response, pin, elementId);
                  break;
                case "V4":
                  v4state = updateElement(response, pin, elementId);
                  break;
                default:
                  updateElement(response, pin, elementId);
                  break;
              }
            }
            previousResponse = response; // Update previous response
          }

        }
        else if (response.state===false){
          trgr=true;
          var message = document.getElementById("message");
          message.innerHTML = "Disconnected!";
          message.style.color = "red";
          var color1 = document.getElementById("color0");
          var color2 = document.getElementById("color1");
          var color3 = document.getElementById("color2");
          var color4 = document.getElementById("color3");
          color1.style.backgroundColor = "black";
          color2.style.backgroundColor = "black";
          color3.style.backgroundColor = "black";
          color4.style.backgroundColor = "black";
        }
      }
    }
  )}
  else {
    //console.log("offline");
    trgr=true;
    var message = document.getElementById("message");
    console.log(v1state,v2state,v2state,v4state);
    message.innerHTML = "Disconnected!";
    message.style.color = "red";
    var color1 = document.getElementById("color0");
    var color2 = document.getElementById("color1");
    var color3 = document.getElementById("color2");
    var color4 = document.getElementById("color3");
    color1.style.backgroundColor = "black";
    color2.style.backgroundColor = "black";
    color3.style.backgroundColor = "black";
    color4.style.backgroundColor = "black";
    }
}

//setInterval(getvalue, 500);

//Brings back the origional COlor of state
function getcolor(state, pin) {
  var col;
  switch (pin) {
    case "V1":
      col = "color";
      break;
    case "V2":
      col = "color1";
      break;
    case "V3":
      col = "color2";
      break;
    case "V4":
      col = "color3";
      break;
    default:
      return; // Exit function if pin is not recognized
  }
  var color = document.getElementById(col);
  if (state === 1) {
    color.style.backgroundColor = "red";
  } else if (state === 0) {
    color.style.backgroundColor = "#26a9e0";
  }
}

*/
