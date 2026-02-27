import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// --- 1. FIREBASE CONFIG ---
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

// --- 2. CONDUCTOR LOGIC (Sender) ---
window.submitData = function() {
    console.log("Submit button clicked!"); 
    const nextStop = document.getElementById("stop").value;
    const boardVal = document.getElementById("board").value || 0;
    const dropVal = document.getElementById("drop").value || 0;

    set(ref(db, "busData"), {
        stopName: nextStop,
        boarding: boardVal,
        dropping: dropVal
    }).then(() => {
        console.log("Data sent to Firebase!");
        alert("Driver Notified!");
    }).catch((error) => {
        console.error("Firebase Error:", error);
    });
};

// --- 3. RESET LOGIC (Clearer) ---
window.resetData = function() {
    console.log("Reset button clicked!");
    set(ref(db, "busData"), {
        stopName: "Bus in Transit...",
        boarding: 0, // Matched name to 'boarding'
        dropping: 0  // Matched name to 'dropping'
    }).then(() => {
        document.getElementById("board").value = "";
        document.getElementById("drop").value = "";
        alert("Display Cleared!");
    });
};

// --- 4. DRIVER LOGIC (Receiver) ---
const displayBox = document.getElementById("display");

if (displayBox) {
    onValue(ref(db, "busData"), (snapshot) => {
        const data = snapshot.val();
        if (data) {
            // Updated UI with a clean look
            displayBox.innerHTML = `
                <h2 style="color: #007bff; margin: 0;">Next: ${data.stopName}</h2>
                <hr>
                <p style="font-size: 22px;">Boarding: <b style="color:green">${data.boarding}</b></p>
                <p style="font-size: 22px;">Deboarding: <b style="color:red">${data.dropping}</b></p>
            `;

            // Only speak and play sound if it's a real stop
            if (data.stopName !== "Bus in Transit...") {
                playChime();
                announceStop(data.stopName);
            }
        }
    });
}

// --- 5. AUDIO & VOICE FUNCTIONS ---
function playChime() {
    const audio = new Audio('https://www.soundjay.com/buttons/beep-08b.mp3');
    audio.play().catch(e => console.log("Audio play blocked until user interacts with page."));
}

function announceStop(stopName) {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance("Next stop is " + stopName);
    msg.rate = 0.9; // Slightly slower for clarity
    window.speechSynthesis.speak(msg);
}