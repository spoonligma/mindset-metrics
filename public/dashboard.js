// dashboard.js
import { db } from "./firebase-config.js";
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";



const checkinContainer = document.getElementById("checkinContainer");

async function fetchCheckins() {
  try {
    const checkinsRef = collection(db, "checkins");
    const q = query(checkinsRef, orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      checkinContainer.innerHTML = "<p>No check-ins yet.</p>";
      return;
    }

    const table = document.createElement("table");
    table.innerHTML = `
      <tr>
        <th>Date</th>
        <th>Mood</th>
        <th>Focus</th>
        <th>Stress</th>
        <th>Tag</th>
        <th>Notes</th>
      </tr>
    `;

    snapshot.forEach(doc => {
      const data = doc.data();
      const date = new Date(data.timestamp.seconds * 1000).toLocaleString();
      const row = `
        <tr>
          <td>${date}</td>
          <td>${data.mood}</td>
          <td>${data.focus}</td>
          <td>${data.stress}</td>
          <td>${data.eventTag}</td>
          <td>${data.notes || ""}</td>
        </tr>
      `;
      table.innerHTML += row;
    });

    checkinContainer.appendChild(table);
  } catch (error) {
    console.error("Error fetching check-ins:", error);
    checkinContainer.innerHTML = "<p>Failed to load check-ins.</p>";
  }
}

fetchCheckins();

async function loadChartData() {
  const q = query(collection(db, "checkins"), orderBy("timestamp", "asc"));
  const snapshot = await getDocs(q);

  const dates = [];
  const moodData = [];
  const focusData = [];
  const stressData = [];

  snapshot.forEach(doc => {
    const data = doc.data();
    const date = new Date(data.timestamp.seconds * 1000).toLocaleDateString();
    dates.push(date);
    moodData.push(data.mood);
    focusData.push(data.focus);
    stressData.push(data.stress);
  });

  drawChart(dates, moodData, focusData, stressData);
}

function drawChart(labels, moodData, focusData, stressData) {
  const ctx = document.getElementById("moodChart").getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Mood",
          data: moodData,
          borderColor: "#28a745",
          fill: false,
        },
        {
          label: "Focus",
          data: focusData,
          borderColor: "#007bff",
          fill: false,
        },
        {
          label: "Stress",
          data: stressData,
          borderColor: "#dc3545",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Mental Performance Over Time" },
      },
    },
  });
}

window.addEventListener("DOMContentLoaded", loadChartData);