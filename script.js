const stops = [
"Pala",
"Ramapuram",
"Kuravilangad",
"Ettumanoor",
"Kottayam"
];

let passengers = [];

const dropdown = document.getElementById("stopSelect");

if(dropdown){
stops.forEach(stop=>{
let option=document.createElement("option");
option.value=stop;
option.textContent=stop;
dropdown.appendChild(option);
});
}

function addPassenger(){

let selectedStop = dropdown.value;

passengers.push({
stop:selectedStop
});

document.getElementById("status").innerText =
"Passenger added for "+selectedStop+
" | Total passengers: "+passengers.length;

console.log(passengers);
}
let currentStopIndex = 0;

function updateDriver(){

let nextStop = stops[currentStopIndex];

let count = passengers.filter(p=>p.stop===nextStop).length;

let stopDisplay = document.getElementById("nextStop");
let countDisplay = document.getElementById("count");

if(stopDisplay){
stopDisplay.innerText = "Next Stop: "+nextStop;
countDisplay.innerText = "Passengers Getting Down: "+count;
}
announceStop(nextStop);
currentStopIndex++;

if(currentStopIndex>=stops.length){
currentStopIndex=0;
}
}

setInterval(updateDriver,8000);
function announceStop(stop){

let speech = new SpeechSynthesisUtterance();

speech.text = "Next stop "+stop+". Passengers please get ready.";

speech.volume = 1;
speech.rate = 1;
speech.pitch = 1;

speechSynthesis.speak(speech);
}