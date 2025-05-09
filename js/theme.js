// Theme Toggle Functionality
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle")

  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem("theme")
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

  // Set initial theme
  if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
    document.documentElement.classList.add("dark")
  } else {
    document.documentElement.classList.add("light")
  }

  // Toggle theme when button is clicked
  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark")

    if (isDark) {
      document.documentElement.classList.remove("dark")
      document.documentElement.classList.add("light")
      localStorage.setItem("theme", "light")
    } else {
      document.documentElement.classList.remove("light")
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    }
  })
})
