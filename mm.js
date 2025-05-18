document.addEventListener("DOMContentLoaded", function () {
  const signupButton = document.querySelector("button");
  const emailInput = document.querySelector('input[type="email"]');

  signupButton.addEventListener("click", () => {
    const email = emailInput.value.trim();

    if (email && email.includes("@") && email.includes(".")) {
      // Simulate saving the email (in real case, you’d send it to a backend)
      console.log("Signed up:", email);
      localStorage.setItem("earlySignupEmail", email);

      alert("Thanks for signing up! We'll be in touch.");
      emailInput.value = "";
    } else {
      alert("Please enter a valid email.");
    }
  });
});