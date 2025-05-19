import { db } from "./firebase-config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// DOM elements
const signupBtn = document.getElementById("signupButton");
const emailInput = document.getElementById("emailInput");
const confirmationMessage = document.getElementById("confirmationMessage");

const checkinBtn = document.getElementById("submitCheckin");
const moodRange = document.getElementById("mood");
const focusRange = document.getElementById("focus");
const stressRange = document.getElementById("stress");
const eventSelect = document.getElementById("tag");
const notes = document.getElementById("journal");
const checkinConfirmation = document.getElementById("checkinConfirmation");

const moodValue = document.getElementById("moodValue");
const focusValue = document.getElementById("focusValue");
const stressValue = document.getElementById("stressValue");

// Helper function to trigger fade-in animation
function fadeIn(element) {
  element.classList.remove("fade-in"); // Reset
  void element.offsetWidth; // Reflow
  element.classList.add("fade-in");
}

// Update slider values dynamically
moodRange.addEventListener("input", () => {
  moodValue.textContent = moodRange.value;
});
focusRange.addEventListener("input", () => {
  focusValue.textContent = focusRange.value;
});
stressRange.addEventListener("input", () => {
  stressValue.textContent = stressRange.value;
});

// Sign-up button handler
signupBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();

  if (!email) {
    confirmationMessage.textContent = "Please enter a valid email.";
    confirmationMessage.style.color = "red";
    confirmationMessage.classList.remove("hidden");
    fadeIn(confirmationMessage);
    return;
  }

  try {
    await addDoc(collection(db, "signups"), {
      email,
      timestamp: new Date()
    });

    confirmationMessage.textContent = "Thanks for signing up!";
    confirmationMessage.style.color = "#28a745";
    confirmationMessage.classList.remove("hidden");
    fadeIn(confirmationMessage);
    emailInput.value = "";
  } catch (error) {
    console.error("Error adding signup: ", error);
    confirmationMessage.textContent = "Oops! Something went wrong.";
    confirmationMessage.style.color = "red";
    confirmationMessage.classList.remove("hidden");
    fadeIn(confirmationMessage);
  }
});

// Check-in button handler
checkinBtn.addEventListener("click", async () => {
  const mood = Number(moodRange.value);
  const focus = Number(focusRange.value);
  const stress = Number(stressRange.value);
  const eventTag = eventSelect.value;
  const noteText = notes.value.trim();

  try {
    await addDoc(collection(db, "checkins"), {
      mood,
      focus,
      stress,
      eventTag,
      notes: noteText,
      timestamp: new Date()
    });

    checkinConfirmation.textContent = "Check-in submitted successfully!";
    checkinConfirmation.style.color = "#28a745";
    checkinConfirmation.classList.remove("hidden");
    fadeIn(checkinConfirmation);

    // Reset inputs
    moodRange.value = 5;
    focusRange.value = 5;
    stressRange.value = 5;
    eventSelect.value = "practice";
    notes.value = "";

    moodValue.textContent = moodRange.value;
    focusValue.textContent = focusRange.value;
    stressValue.textContent = stressRange.value;
  } catch (error) {
    console.error("Error adding check-in: ", error);
    checkinConfirmation.textContent = "Failed to submit check-in.";
    checkinConfirmation.style.color = "red";
    checkinConfirmation.classList.remove("hidden");
    fadeIn(checkinConfirmation);
  }
});