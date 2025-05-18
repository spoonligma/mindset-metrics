document.addEventListener("DOMContentLoaded", () => {
  const signupButton = document.querySelector(".signup button");
  const emailInput = document.querySelector(".signup input[type='email']");
  const confirmationMessage = document.getElementById("confirmationMessage");

  signupButton.addEventListener("click", () => {
    const email = emailInput.value.trim();

    // Basic email validation
    if (email && email.includes("@") && email.includes(".")) {
      // Simulate saving email
      localStorage.setItem("earlySignupEmail", email);

      // Show confirmation message with fade in
      confirmationMessage.textContent = `Thanks for signing up, ${email}! We'll be in touch.`;
      confirmationMessage.style.opacity = "0";
      confirmationMessage.style.display = "block";

      // Animate fade in
      let opacity = 0;
      const fadeIn = setInterval(() => {
        if (opacity >= 1) {
          clearInterval(fadeIn);
          // Fade out after 3 seconds
          setTimeout(() => fadeOutMessage(), 3000);
        } else {
          opacity += 0.05;
          confirmationMessage.style.opacity = opacity;
        }
      }, 30);

      // Clear input
      emailInput.value = "";
    } else {
      alert("Please enter a valid email.");
    }
  });

  function fadeOutMessage() {
    let opacity = 1;
    const fadeOut = setInterval(() => {
      if (opacity <= 0) {
        clearInterval(fadeOut);
        confirmationMessage.style.display = "none";
        confirmationMessage.textContent = "";
      } else {
        opacity -= 0.05;
        confirmationMessage.style.opacity = opacity;
      }
    }, 30);
  }
});