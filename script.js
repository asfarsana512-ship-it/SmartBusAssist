import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// --- PASTE YOUR ACTUAL CONFIG HERE ---
const firebaseConfig = {
  apiKey: "AIzaSyC3o16hORHSuBeFwXTdomAM-753Sq0au8A",
  authDomain: "smartbusassist.firebaseapp.com",
  databaseURL: "https://smartbusassist-default-rtdb.firebaseio.com/",
  projectId: "smartbusassist",
  storageBucket: "smartbusassist.firebasestorage.app",
  messagingSenderId: "70875036469",
  appId: "1:70875036469:web:1d491fc14d9418ab4e2a7c"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- CONDUCTOR LOGIC ---
window.submitData = function() {
    console.log("Submit button clicked!"); // Check if this shows in Console
    const nextStop = document.getElementById("stop").value;
    const boarding = document.getElementById("board").value || 0;
    const dropping = document.getElementById("drop").value || 0;

    // We use "busData" as our shared folder name
    set(ref(db, "busData"), {
        stopName: nextStop,
        boarding: boarding,
        dropping: dropping
    }).then(() => {
        console.log("Data successfully sent to Firebase!");
        alert("Driver Notified!");
    }).catch((error) => {
        console.error("Firebase Error:", error);
    });
};

// --- DRIVER LOGIC ---
const displayBox = document.getElementById("display");

// This runs only on the Driver page
if (displayBox) {
    console.log("Driver page detected, listening for updates...");
    
    // We listen to the EXACT SAME folder: "busData"
    onValue(ref(db, "busData"), (snapshot) => {
        const data = snapshot.val();
        console.log("New data received from Firebase:", data);
        
        if (data) {
            displayBox.innerHTML = `
                <h2 style="color: #007bff; margin: 0;">Next: ${data.stopName}</h2>
                <hr>
                <p style="font-size: 20px;">Boarding: <b style="color:green">${data.boarding}</b></p>
                <p style="font-size: 20px;">Deboarding: <b style="color:red">${data.dropping}</b></p>
            `;
            announceStop(data.stopName);
        }
    });
}

function announceStop(stopName) {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance("Next stop is " + stopName);
    window.speechSynthesis.speak(msg);
}