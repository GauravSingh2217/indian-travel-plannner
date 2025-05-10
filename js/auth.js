import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

document.addEventListener("DOMContentLoaded", () => {
  // Check if user is already logged in
  checkAuthState()

  // Handle login form submission
  const loginForm = document.getElementById("login-form")
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      const errorElement = document.getElementById("login-error")
      const submitButton = loginForm.querySelector("button[type='submit']")
      const originalButtonText = submitButton.textContent

      try {
        // Show loading state
        submitButton.textContent = "Logging in..."
        submitButton.disabled = true

        // Sign in with Supabase
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          throw error
        }

        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(data.user))

        // Redirect to home page or dashboard
        window.location.href = "itineraries.html"
      } catch (error) {
        console.error("Login error:", error)
        errorElement.textContent = error.message || "Invalid email or password"
        errorElement.style.display = "block"

        // Reset button state
        submitButton.textContent = originalButtonText
        submitButton.disabled = false
      }
    })
  }

  // Handle signup form submission
  const signupForm = document.getElementById("signup-form")
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const firstName = document.getElementById("first-name").value
      const lastName = document.getElementById("last-name").value
      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      const confirmPassword = document.getElementById("confirm-password").value
      const errorElement = document.getElementById("signup-error")
      const submitButton = signupForm.querySelector("button[type='submit']")
      const originalButtonText = submitButton.textContent

      // Validate passwords match
      if (password !== confirmPassword) {
        errorElement.textContent = "Passwords do not match"
        errorElement.style.display = "block"
        return
      }

      try {
        // Show loading state
        submitButton.textContent = "Creating account..."
        submitButton.disabled = true

        // Sign up with Supabase
        const { data, error } = await supabaseClient.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
            },
          },
        })

        if (error) {
          throw error
        }

        // After successful signup, insert user data into users table
        const { error: profileError } = await supabaseClient.from("users").insert([
          {
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: "hashed_password_placeholder", // In a real app, you wouldn't store passwords in this table
          },
        ])

        if (profileError) {
          console.error("Error creating user profile:", profileError)
        }

        // Show success message and redirect
        alert("Account created successfully! You can now log in.")
        window.location.href = "login.html"
      } catch (error) {
        console.error("Signup error:", error)
        errorElement.textContent = error.message || "Error creating account"
        errorElement.style.display = "block"

        // Reset button state
        submitButton.textContent = originalButtonText
        submitButton.disabled = false
      }
    })
  }

  // Handle logout
  const logoutButton = document.getElementById("logout-btn")
  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      try {
        await supabaseClient.auth.signOut()
        localStorage.removeItem("user")
        window.location.href = "index.html"
      } catch (error) {
        console.error("Logout error:", error)
        alert("Error logging out. Please try again.")
      }
    })
  }

  // Check authentication state and update UI
  async function checkAuthState() {
    try {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession()

      // Get all nav elements that need to be updated
      const loginButtons = document.querySelectorAll(".nav-actions a[href='login.html']")
      const signupButtons = document.querySelectorAll(".nav-actions a[href='signup.html']")
      const navActions = document.querySelector(".nav-actions")
      const mobileActions = document.querySelector(".mobile-actions")

      if (session) {
        // User is logged in
        const user = session.user

        // Update navigation for logged-in user
        if (navActions) {
          // Remove login and signup buttons
          loginButtons.forEach((btn) => btn.remove())
          signupButtons.forEach((btn) => btn.remove())

          // Add user menu
          const userMenuHTML = `
            <div class="user-menu">
              <button class="user-menu-btn">
                <span>${user.user_metadata.first_name || "User"}</span>
                <i class="fas fa-chevron-down"></i>
              </button>
              <div class="user-dropdown">
                <a href="profile.html">Profile</a>
                <a href="itineraries.html">My Itineraries</a>
                <button id="logout-btn">Logout</button>
              </div>
            </div>
          `

          navActions.insertAdjacentHTML("beforeend", userMenuHTML)

          // Add event listener for user menu toggle
          const userMenuBtn = document.querySelector(".user-menu-btn")
          const userDropdown = document.querySelector(".user-dropdown")

          if (userMenuBtn && userDropdown) {
            userMenuBtn.addEventListener("click", () => {
              userDropdown.classList.toggle("active")
            })

            // Close dropdown when clicking outside
            document.addEventListener("click", (e) => {
              if (!e.target.closest(".user-menu")) {
                userDropdown.classList.remove("active")
              }
            })
          }
        }

        // Update mobile menu
        if (mobileActions) {
          mobileActions.innerHTML = `
            <a href="profile.html" class="mobile-link">Profile</a>
            <a href="itineraries.html" class="mobile-link">My Itineraries</a>
            <button id="mobile-logout-btn" class="btn btn-outline btn-full">Logout</button>
          `

          // Add event listener for mobile logout
          const mobileLogoutBtn = document.getElementById("mobile-logout-btn")
          if (mobileLogoutBtn) {
            mobileLogoutBtn.addEventListener("click", async () => {
              try {
                await supabaseClient.auth.signOut()
                localStorage.removeItem("user")
                window.location.href = "index.html"
              } catch (error) {
                console.error("Logout error:", error)
                alert("Error logging out. Please try again.")
              }
            })
          }
        }
      }
    } catch (error) {
      console.error("Auth state check error:", error)
    }
  }
})
