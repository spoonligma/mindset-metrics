// checkin.js
import { db } from "./firebase-config.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const auth = getAuth();

const moodSlider = document.getElementById("mood");
const focusSlider = document.getElementById("focus");
const stressSlider = document.getElementById("stress");
const tagSelect = document.getElementById("tag");
const journalTextarea = document.getElementById("journal");
const submitButton = document.getElementById("submitCheckin");
const confirmationDiv = document.getElementById("checkinConfirmation");

submitButton.disabled = true; // disable until user is authenticated

let currentUserUid = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserUid = user.uid;
    submitButton.disabled = false; // enable form submit
  } else {
    currentUserUid = null;
    submitButton.disabled = true;
    confirmationDiv.textContent = "Please log in to submit check-ins.";
    confirmationDiv.classList.remove("hidden");
  }
});

submitButton.addEventListener("click", async () => {
  if (!currentUserUid) {
    confirmationDiv.textContent = "You must be logged in!";
    confirmationDiv.classList.remove("hidden");
    return;
  }

  try {
    await addDoc(collection(db, "checkins"), {
      uid: currentUserUid,
      mood: Number(moodSlider.value),
      focus: Number(focusSlider.value),
      stress: Number(stressSlider.value),
      eventTag: tagSelect.value,
      notes: journalTextarea.value.trim(),
      timestamp: serverTimestamp()
    });
    confirmationDiv.textContent = "Check-in submitted successfully!";
    confirmationDiv.classList.remove("hidden");
    // Optionally clear journal input or reset sliders here
  } catch (error) {
    confirmationDiv.textContent = "Error submitting check-in: " + error.message;
    confirmationDiv.classList.remove("hidden");
  }
});