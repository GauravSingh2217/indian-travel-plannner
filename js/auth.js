document.addEventListener("DOMContentLoaded", () => {
  // Form submission handling
  const authForm = document.querySelector(".auth-form")

  if (authForm) {
    authForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // In a real app, this would handle form submission to a server
      // For now, just show an alert
      const isLoginForm = window.location.pathname.includes("login")

      if (isLoginForm) {
        alert("Login successful! Redirecting to dashboard...")
        setTimeout(() => {
          window.location.href = "index.html"
        }, 1000)
      } else {
        alert("Account created successfully! Redirecting to login...")
        setTimeout(() => {
          window.location.href = "login.html"
        }, 1000)
      }
    })
  }
})
