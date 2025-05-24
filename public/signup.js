// signup.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDGzYfj5TE9zksU0nTno6KS9Ogb00Qwt70",
  authDomain: "mindsetmetrics-3c59c.firebaseapp.com",
  projectId: "mindsetmetrics-3c59c",
  storageBucket: "mindsetmetrics-3c59c.appspot.com",
  messagingSenderId: "1026364419510",
  appId: "1:1026364419510:web:4edae79f926245e733e517",
  measurementId: "G-C1NSXTE8MM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const signupForm = document.getElementById('signup-form');
const errorMessage = document.getElementById('error-message');

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = signupForm['email'].value;
  const password = signupForm['password'].value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    window.location.href = 'index.html'; // redirect after successful signup
  } catch (error) {
    console.error(error);
    errorMessage.textContent = "Sign-up failed: " + error.message;
  }
});