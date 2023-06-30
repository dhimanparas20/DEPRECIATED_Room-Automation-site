`use strict`;
function refreshTime() {
  const timeDisplay = document.getElementById("time");
  const dateString = new Date().toLocaleString();
  const formattedString = dateString.replace(", ", " - ");
  timeDisplay.textContent = formattedString;
}
  setInterval(refreshTime, 1000);

  function myFunc(val,div) {
    var x = document.getElementById(div);
    //var x = document.querySelectorAll('[id=myDIV]');
    if (x.innerHTML === "OFF") {
      trigger(1,val)
      x.innerHTML = "ON";
    } else {
      trigger(0,val)
      x.innerHTML = "OFF";
    }
  }

  function trigger(value,pin) {  
  var xhReq = new XMLHttpRequest();
  xhReq.open("GET", "https://blr1.blynk.cloud/external/api/update?token=g2-VR83SfRVfmPIMoTQLX0nCrWbJQ9kA&"+pin+"="+value, false);
  xhReq.send(null);
  var serverResponse = xhReq.responseText;
  } 

  var previousResponse;
  var previousstate;
  var trgr = false;
  var v1state;
  var v2state;
  var v3state;
  var v4state;
  function getvalue() {  
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
                //console.log("Trigger callued======================================");
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

              if (!isResponseEqual(response, previousResponse)) {
                    if(response.V1==1){
                      var x = document.getElementById("myDIV");
                      var color = document.getElementById("color");
                      x.innerHTML = "ON";
                      color.style.backgroundColor = "red"; 
                      v1state = 1;
                      }
                    else {
                      var x = document.getElementById("myDIV");
                      var color = document.getElementById("color");
                      x.innerHTML = "OFF";
                      color.style.backgroundColor = "#26a9e0"; 
                      v1state = 0;
                    } 

                    if(response.V2==1){
                      var x = document.getElementById("myDIV1");
                      var color = document.getElementById("color1");
                      x.innerHTML = "ON"; 
                      color.style.backgroundColor = "red"; 
                      v2state = 1;               
                      }
                    else {
                      var x = document.getElementById("myDIV1");
                      var color = document.getElementById("color1");
                      x.innerHTML = "OFF";
                      color.style.backgroundColor = "#26a9e0"; 
                      v2state = 0;
                    } 
                    
                    if(response.V3==1){
                      var x = document.getElementById("myDIV2");
                      var color = document.getElementById("color2");
                      x.innerHTML = "ON";
                      color.style.backgroundColor = "red";
                      v3state = 1;
                      
                      }
                    else {
                      var x = document.getElementById("myDIV2");
                      var color = document.getElementById("color2");
                      x.innerHTML = "OFF";
                      color.style.backgroundColor = "#26a9e0"; 
                      v3state = 0;
                    } 
                    if(response.V4==1){
                      var x = document.getElementById("myDIV3");
                      var color = document.getElementById("color3");
                      x.innerHTML = "ON";
                      color.style.backgroundColor = "red";
                      v4state = 1;
                      
                      }
                    else {
                      var x = document.getElementById("myDIV3");
                      var color = document.getElementById("color3");
                      x.innerHTML = "OFF";
                      color.style.backgroundColor = "#26a9e0"; 
                      v4state = 0;
                    }  
                    previousResponse = response; // Update previous response
                }
             }
             else if (response.state===false){
              trgr=true;
              var message = document.getElementById("message");
              message.innerHTML = "Disconnected!";
              message.style.color = "red";
              var color1 = document.getElementById("color");
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
  setInterval(getvalue, 1000); 

  function isResponseEqual(response1, response2) {
    // Return true if responses are equal, false otherwise
    return JSON.stringify(response1) === JSON.stringify(response2);
  }

  //Brings back the origional COlor of state
  function getcolor(state,pin){
    var col;
    if (pin==="V1"){
      col = "color";  
    }
    else if (pin==="V2"){
      col = "color1";  
    }
    else if (pin==="V3"){
      col = "color2";  
    }
    else if (pin==="V4"){
      col = "color3";  
    }
    if (state===1){
      var color = document.getElementById(col);
      color.style.backgroundColor = "red";
    }
    else if (state===0){
      var color = document.getElementById(col);
      color.style.backgroundColor = "#26a9e0";
    }
  }


  
