// dashboard.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, query, where, orderBy, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Firebase config

console.log("Dashboard.js loaded");

const firebaseConfig = {
  apiKey: "AIzaSyDGzYfj5TE9zksU0nTno6KS9Ogb00Qwt70",
  authDomain: "mindsetmetrics-3c59c.firebaseapp.com",
  projectId: "mindsetmetrics-3c59c",
  storageBucket: "mindsetmetrics-3c59c.appspot.com",
  messagingSenderId: "1026364419510",
  appId: "1:1026364419510:web:4edae79f926245e733e517",
  measurementId: "G-C1NSXTE8MM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// DOM Elements
const checkinContainer = document.getElementById("checkinContainer");

// Listen for auth state changes
onAuthStateChanged(auth, user => {
  if (user) {
    console.log("User logged in:", user.uid);
    fetchCheckins(user.uid);
    loadChartData(user.uid);
  } else {
    console.log("No user logged in, redirecting to login page...");
    window.location.href = "login.html";
  }
});

// Fetch user's check-ins from Firestore
async function fetchCheckins(uid) {
  try {
    console.log("Fetching check-ins for UID:", uid);
    const checkinsRef = collection(db, "checkins");
    const q = query(checkinsRef, where("uid", "==", uid), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      checkinContainer.innerHTML = "<p>No check-ins yet.</p>";
      return;
    }

    // Create a table and header row
    const table = document.createElement("table");
    table.innerHTML = `
      <thead>
        <tr>
          <th>Date</th>
          <th>Mood</th>
          <th>Focus</th>
          <th>Stress</th>
          <th>Tag</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");

    // Populate table rows with check-in data
    snapshot.forEach(doc => {
      const data = doc.data();

      // Safely convert Firestore timestamp to JS Date
      let dateStr = "";
      if (data.timestamp && data.timestamp.toDate) {
        dateStr = data.timestamp.toDate().toLocaleString();
      } else {
        dateStr = "No timestamp";
      }

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${dateStr}</td>
        <td>${data.mood ?? ""}</td>
        <td>${data.focus ?? ""}</td>
        <td>${data.stress ?? ""}</td>
        <td>${data.eventTag ?? ""}</td>
        <td>${data.notes ?? ""}</td>
      `;

      tbody.appendChild(row);
    });

    // Clear existing content and append the table
    checkinContainer.innerHTML = "";
    checkinContainer.appendChild(table);
  } catch (error) {
    console.error("Error fetching check-ins:", error);
    checkinContainer.innerHTML = "<p>Failed to load check-ins.</p>";
  }
}

// Load data for chart from Firestore
async function loadChartData(uid) {
  try {
    const checkinsRef = collection(db, "checkins");
    const q = query(checkinsRef, where("uid", "==", uid), orderBy("timestamp", "asc"));
    const snapshot = await getDocs(q);

    const dates = [];
    const moodData = [];
    const focusData = [];
    const stressData = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.timestamp && data.timestamp.toDate) {
        dates.push(data.timestamp.toDate().toLocaleDateString());
        moodData.push(data.mood ?? null);
        focusData.push(data.focus ?? null);
        stressData.push(data.stress ?? null);
      }
    });

    drawChart(dates, moodData, focusData, stressData);
  } catch (error) {
    console.error("Error loading chart data:", error);
  }
}

// Draw chart with Chart.js
function drawChart(labels, moodData, focusData, stressData) {
  const ctx = document.getElementById("moodChart").getContext("2d");

  // Clear previous chart if exists (optional)
  if (window.myChart) {
    window.myChart.destroy();
  }

  window.myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Mood",
          data: moodData,
          borderColor: "#28a745",
          fill: false,
          tension: 0.3
        },
        {
          label: "Focus",
          data: focusData,
          borderColor: "#007bff",
          fill: false,
          tension: 0.3
        },
        {
          label: "Stress",
          data: stressData,
          borderColor: "#dc3545",
          fill: false,
          tension: 0.3
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Mental Performance Over Time" },
      },
      scales: {
        y: {
          min: 0,
          max: 10,
          ticks: { stepSize: 1 }
        }
      }
    },
  });
}