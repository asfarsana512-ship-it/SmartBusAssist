import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue, update, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

// EXACT SEQUENCE FOR N-1 LOGIC
const route = ["Pala", "Lalam Junction", "Puliyaannoor", "Mutholy", "Cherpunkal"];

// --- CONDUCTOR ACTIONS ---
window.bookPassenger = function() {
    const dest = document.getElementById("passengerDest").value;
    update(ref(db, 'busData/destinations'), { [dest]: increment(1) });
};

window.updateLocation = function() {
    const loc = document.getElementById("currentBusStop").value;
    // 1. Update Current Location
    update(ref(db, 'busData'), { currentLocation: loc }).then(() => {
        // 2. WAIT 15 SECONDS THEN CLEAR (Demo Visibility)
        setTimeout(() => {
            set(ref(db, `busData/destinations/${loc}`), 0);
        }, 15000);
    });
};

window.resetTrip = function() {
    if(confirm("Wipe all trip data?")) {
        set(ref(db, 'busData'), {
            currentLocation: "Starting",
            destinations: { "Pala": 0, "Lalam Junction": 0, "Puliyaannoor": 0, "Mutholy": 0, "Cherpunkal": 0 }
        }).then(() => location.reload());
    }
};

// --- DRIVER DISPLAY & VOICE ---
const displayBox = document.getElementById("display");
let lastStop = "";

if (displayBox) {
    onValue(ref(db, "busData"), (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        const curr = data.currentLocation || "Starting";
        const dests = data.destinations || {};
        const leaveNow = dests[curr] || 0;

        const idx = route.indexOf(curr);
        const next = route[idx + 1] || "Destination Reached";
        const leaveNext = dests[next] || 0;

        displayBox.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <label>PALA-CHERPUNKAL</label>
                <div id="liveClock"></div>
            </div>
            <div class="stop-highlight">${curr}</div>
            
            <div class="stats-grid">
                <div class="stat-card danger-bg">
                    <label>ഇറങ്ങേണ്ടവർ (NOW)</label>
                    <div style="font-size:3rem; font-weight:800;">${leaveNow}</div>
                </div>
                <div class="stat-card boarding-bg">
                    <label>അടുത്ത സ്റ്റോപ്പ്</label>
                    <div style="font-size:1.1rem; font-weight:700; margin-top:5px;">${next}</div>
                </div>
            </div>

            <div style="margin-top:15px; padding:15px; background:rgba(56, 189, 248, 0.1); border-radius:12px; border-left:4px solid var(--primary);">
                <label>PREPARE ALERT</label>
                <strong>${next}</strong>: ${leaveNext} Passengers
            </div>
        `;

        if (curr !== "Starting" && curr !== lastStop) {
            announce(curr, leaveNow, next, leaveNext);
            lastStop = curr;
        }
    });
}

function announce(curr, cCount, next, nCount) {
    window.speechSynthesis.cancel();
    const ml = window.speechSynthesis.getVoices().find(v => v.lang.includes('ml'));
    let msg = new SpeechSynthesisUtterance();

    let text = `ഇപ്പോൾ ${curr} എത്തിയിരിക്കുന്നു. `;
    if (cCount > 0) text += `${cCount} യാത്രക്കാർ ദയവായി ഇറങ്ങുക. `;
    if (next !== "Destination Reached" && nCount > 0) {
        text += ` അടുത്ത സ്റ്റോപ്പ് ${next} ആണ്. ${nCount} യാത്രക്കാർ തയ്യാറെടുക്കുക.`;
    }

    if (ml) { msg.lang = 'ml-IN'; msg.voice = ml; }
    else { msg.text = `Arrived at ${curr}. Next stop ${next}.`; msg.lang = 'en-IN'; }
    
    msg.rate = 0.85;
    window.speechSynthesis.speak(msg);
}

setInterval(() => {
    const c = document.getElementById('liveClock');
    if(c) c.innerText = new Date().toLocaleTimeString();
}, 1000);