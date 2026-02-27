import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

/* FIREBASE CONFIG */
const firebaseConfig = {
  apiKey: "AIzaSyC3o16hORHSuBeFwXTdomAM-753Sq0au8A",
  authDomain: "smartbusassist.firebaseapp.com",
  projectId: "smartbusassist",
  storageBucket: "smartbusassist.firebasestorage.app",
  messagingSenderId: "70875036469",
  appId: "1:70875036469:web:1d491fc14d9418ab4e2a7c",
  databaseURL: "https://smartbusassist-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* CONDUCTOR SUBMIT */
window.submitPassengers = function () {
  const stop = document.getElementById("stop").value;
  const board = document.getElementById("board").value;
  const drop = document.getElementById("drop").value;

  set(ref(db, "busData"), {
    nextStop: stop,
    boarding: board,
    dropping: drop
  });

  alert("Data Sent to Driver Panel");
};

/* DRIVER LIVE UPDATE */
const display = document.getElementById("display");

if (display) {
  const dataRef = ref(db, "busData");

  onValue(dataRef, (snapshot) => {
    const data = snapshot.val();

    if (data) {
      display.innerHTML = `
        Next Stop: ${data.nextStop}<br>
        Boarding: ${data.boarding}<br>
        Dropping: ${data.dropping}
      `;

      speakStop(data.nextStop);
    }
  });
}

/* VOICE ANNOUNCEMENT */
function speakStop(stop) {
  const msg = new SpeechSynthesisUtterance("Next stop is " + stop);
  speechSynthesis.speak(msg);
}