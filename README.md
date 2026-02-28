# SmartBusAssist 🚌 

**SmartBusAssist** is a cloud-synchronized transit ecosystem developed for **Tink-Her-Hack**. It bridges the communication gap between bus conductors and drivers while providing automated, localized audio alerts for passengers.





**Team Name** : ORBIT




**Team Members** : Farsana A S  Mar Athanasius College of Engineering



**Hosted Project Link** :https://asfarsana512-ship-it.github.io/SmartBusAssist/
---

## 📑 Project Description
In local transit, passengers often miss their stops or rush to the door at the last second. Our system uses a centralized Firebase cloud to sync conductor ticket data with a driver’s dashboard in real-time. It uses **n-1 predictive logic** to warn specific passengers in **Malayalam** to prepare for deboarding before the bus reaches their stop.
## 📍 Problem Statement
In local transit, passengers—especially the elderly or those unfamiliar with the route—often miss their stops or rush to the door at the last second. This "last-minute rush" while the bus is in motion leads to safety risks, falls, and operational delays. Existing GPS-only apps are often inaccurate in rural areas and don't inform the **Driver** of the passenger manifest.



---

## 💡 The Solution
Our system digitizes the passenger manifest in real-time. By syncing the conductor's ticketing data with a central cloud, we provide the driver with a **Live Dashbaord**. 
- **N-1 Predictive Logic:** Automatically warns specific passengers at the *previous* stop to gather their belongings.
- **Localized Accessibility:** Voice alerts are delivered in **Malayalam** (`ml-IN`) for inclusive transit.
- **Dynamic Sync:** Sub-second synchronization ensures the driver knows exactly who is getting off at the next stop.


🛠 Technical Details
Technologies & Components Used
For Software:
Languages used: * JavaScript (ES6+): The core logic for real-time data handling and the Predictive N-1 algorithm.
HTML5 & CSS3: For the "Modern Fleet" responsive user interface.
Frameworks & Platforms used: * Firebase (Google Cloud): Used for the Real-time Database (NoSQL) to ensure sub-second synchronization between the Conductor and Driver.
GitHub Pages: Used for cloud hosting and deployment of the web application.
Libraries & APIs used: * Web Speech API: Leveraged for the native Malayalam (ml-IN) text-to-speech engine to provide hands-free audio alerts.
Firebase SDK: Integrated for the real-time "OnValue" and "Update" listeners.
Tools used: * VS Code: Primary code editor for development.
Git & GitHub: For version control and collaborative workflow.
Firebase Console: For database management and monitoring live traffic.


## ✨ Key Features
- **Real-Time Manifest:** Sub-second synchronization using Firebase Realtime Database.
- **Predictive Alerts:** Automated $n-1$ logic warns passengers one stop early.
- **Localized Accessibility:** Voice alerts in **Malayalam** (`ml-IN`) for inclusive transit.
- **Auto-Clear Logic:** Intelligent 15-second delay before clearing deboarded passenger counts.
- **Geographic Focus:** Optimized for the Pala-Cherpunkal route.


##Project Screenshots
1. Driver Smart-Dashboard
The main interface for the bus driver. It displays the current location in large, high-visibility text and uses a Live Countdown for passengers deboarding at the current stop. It also shows the Prepare Warning for the upcoming stop based on the N-1 logic.
<img width="1446" height="957" alt="image" src="https://github.com/user-attachments/assets/a08eac07-d2e8-462e-9bc5-eafa053f869d" />

2. Conductor Ticketing & Control Panel
The mobile-responsive interface used by the conductor. It allows for one-tap ticket issuance to specific destinations and a manual location update toggle that synchronizes instantly with the cloud database
<img width="1622" height="1018" alt="image" src="https://github.com/user-attachments/assets/6ae6be3b-c244-46b7-bc63-da3b89e27fd3" />
.


.
---

## 🚀 Live Demo

https://vscode.dev/github/asfarsana512-ship-it/SmartBusAssist/blob/main/demo%20Video%20webapp%202026-02-28%20at%209.05.18%20AM.mp4

---





---

## 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3, JavaScript (ES6)
- **Backend/Database:** Firebase Realtime Database
- **Voice Engine:** Web Speech API
- **Version Control:** Git & GitHub

---

## 📂 Repository Structure
```text
├── index.html          # Main Landing & Driver Dashboard
├── conductor.html      # Conductor Ticketing Interface
├── style.css           # Modern Fleet UI Styles
├── script.js           # Firebase Logic & Voice Engine
└── README.md           # Project Documentation



**AI Tools Used**
**Tools Used**: google gemini
**purpose**:To generate codes
**Percentage of AI generated code**:95%
**Human Contributions**:Integration and testing
                         Design and planning 
