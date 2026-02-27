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

const route = ["Pala", "Kottayam", "Ettumanoor", "Kuravilangad", "Changanassery"];

// --- LIVE CLOCK LOGIC ---
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const clockElement = document.getElementById('liveClock');
    if (clockElement) clockElement.innerText = timeString;
}
setInterval(updateClock, 1000);

// --- CONDUCTOR ACTIONS ---
window.bookPassenger = function() {
    const dest = document.getElementById("passengerDest").value;
    update(ref(db, 'busData/destinations'), { [dest]: increment(1) });
    alert("Ticket Issued for " + dest);
};

window.updateLocation = function() {
    const currentLoc = document.getElementById("currentBusStop").value;
    set(ref(db, 'busData/currentLocation'), currentLoc);
};

window.resetTrip = function() {
    if(confirm("Start new trip? All passenger data will be wiped.")) {
        set(ref(db, 'busData'), {
            currentLocation: "Starting",
            destinations: { Pala: 0, Kottayam: 0, Ettumanoor: 0, Kuravilangad: 0, Changanassery: 0 }
        });
    }
};

// --- DRIVER DASHBOARD LOGIC ---
const displayBox = document.getElementById("display");

if (displayBox) {
    onValue(ref(db, "busData"), (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const currentStop = data.currentLocation || "Starting";
            const allDestinations = data.destinations || {};
            const leaveNowCount = allDestinations[currentStop] || 0;

            const currentIndex = route.indexOf(currentStop);
            const nextStopName = route[currentIndex + 1] || "End of Route";
            const leaveNextCount = allDestinations[nextStopName] || 0;

            // Generate Route Progress Bar
            const progressBar = route.map((s, idx) => {
                let color = idx <= currentIndex ? 'var(--success)' : '#475569';
                let weight = s === currentStop ? '800' : '400';
                return `<span style="color: ${color}; font-weight: ${weight}; font-size: 0.7rem;">${s.toUpperCase()}</span>`;
            }).join(' <span style="color:#475569">→</span> ');

            displayBox.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <label>KERALA STATE TRANSIT</label>
                    <div id="liveClock" style="font-weight: bold; color: var(--primary);">00:00:00</div>
                </div>

                <label>CURRENT STATION</label>
                <div class="stop-highlight">${currentStop}</div>
                
                <div class="stats-grid">
                    <div class="stat-card danger-bg">
                        <label style="color: var(--danger)">DEBOARDING</label>
                        <div style="font-size: 3rem; font-weight: 800;">${leaveNowCount}</div>
                    </div>
                    <div class="stat-card" style="background: rgba(255,255,255,0.05); border: 1px solid #475569;">
                        <label>BUS ID</label>
                        <div style="font-size: 1.2rem; font-weight: 700; margin-top:10px;">KL-15-7087</div>
                    </div>
                </div>

                <div style="margin-top: 25px; padding: 20px; background: rgba(56, 189, 248, 0.1); border-radius: 16px; border-left: 4px solid var(--primary);">
                    <label>N-1 PREPARE WARNING</label>
                    <div style="font-size: 1.2rem; font-weight: 700;">Next Stop: ${nextStopName}</div>
                    <div style="color: var(--primary); font-size: 0.9rem;">${leaveNextCount} Passengers need to deboard</div>
                </div>

                <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #334155;">
                    <label style="margin-bottom:10px;">ROUTE PROGRESS</label>
                    <div style="display: flex; justify-content: space-between; align-items: center; gap: 5px;">
                        ${progressBar}
                    </div>
                </div>
            `;

            if (currentStop !== "Starting") {
                announce(currentStop, leaveNowCount, nextStopName, leaveNextCount);
            }
        }
    });
}

function announce(curr, currCount, next, nextCount) {
    window.speechSynthesis.cancel();
    let message = `Now at ${curr}. `;
    if (currCount > 0) message += `${currCount} passengers please exit. `;
    if (next !== "End of Route" && nextCount > 0) {
        message += ` Prepare for ${next}. ${nextCount} passengers deboarding next.`;
    }
    const speech = new SpeechSynthesisUtterance(message);
    speech.rate = 0.95;
    window.speechSynthesis.speak(speech);
}