import { supabaseClient } from "./supabase"

document.addEventListener("DOMContentLoaded", async () => {
  // DOM Elements
  const authCheckMessage = document.getElementById("auth-check-message")
  const loadingIndicator = document.getElementById("loading-indicator")
  const profileContent = document.getElementById("profile-content")
  const profileForm = document.getElementById("profile-form")
  const firstNameInput = document.getElementById("first-name")
  const lastNameInput = document.getElementById("last-name")
  const emailInput = document.getElementById("email")
  const editProfileBtn = document.getElementById("edit-profile-btn")
  const cancelEditBtn = document.getElementById("cancel-edit-btn")
  const profileActions = document.querySelector(".profile-actions")
  const itinerariesCountEl = document.getElementById("itineraries-count")
  const destinationsCountEl = document.getElementById("destinations-count")
  const daysPlannedEl = document.getElementById("days-planned")

  // Check if user is logged in
  const {
    data: { session },
  } = await supabaseClient.auth.getSession()

  if (!session) {
    // User is not logged in, show auth check message
    loadingIndicator.style.display = "none"
    authCheckMessage.style.display = "flex"
    return
  }

  // User is logged in, fetch their profile data
  try {
    const userId = session.user.id

    // Fetch user profile from Supabase
    const { data: profile, error } = await supabaseClient.from("users").select("*").eq("id", userId).single()

    if (error) {
      throw error
    }

    // Fetch user's itineraries for statistics
    const { data: itineraries, error: itinerariesError } = await supabaseClient
      .from("itineraries")
      .select("*")
      .eq("user_id", userId)

    if (itinerariesError) {
      throw itinerariesError
    }

    // Hide loading indicator and show profile content
    loadingIndicator.style.display = "none"
    profileContent.style.display = "block"

    // Populate profile form
    if (profile) {
      firstNameInput.value = profile.first_name || ""
      lastNameInput.value = profile.last_name || ""
      emailInput.value = profile.email || session.user.email || ""
    } else {
      // If no profile exists yet, use data from auth
      firstNameInput.value = session.user.user_metadata?.first_name || ""
      lastNameInput.value = session.user.user_metadata?.last_name || ""
      emailInput.value = session.user.email || ""
    }

    // Calculate statistics
    if (itineraries) {
      // Count of itineraries
      itinerariesCountEl.textContent = itineraries.length

      // Count unique destinations
      const allDestinations = itineraries.flatMap((itinerary) =>
        Array.isArray(itinerary.destinations) ? itinerary.destinations : [],
      )
      const uniqueDestinations = [...new Set(allDestinations)]
      destinationsCountEl.textContent = uniqueDestinations.length

      // Count total days planned
      let totalDays = 0
      itineraries.forEach((itinerary) => {
        if (itinerary.start_date && itinerary.end_date) {
          const start = new Date(itinerary.start_date)
          const end = new Date(itinerary.end_date)
          const diffTime = Math.abs(end - start)
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
          totalDays += diffDays
        }
      })
      daysPlannedEl.textContent = totalDays
    }

    // Handle edit profile button
    if (editProfileBtn) {
      editProfileBtn.addEventListener("click", () => {
        // Enable form fields
        firstNameInput.disabled = false
        lastNameInput.disabled = false
        // Email should remain disabled as it's tied to auth

        // Show form actions
        profileActions.style.display = "flex"
        // Hide edit button
        editProfileBtn.style.display = "none"
      })
    }

    // Handle cancel edit button
    if (cancelEditBtn) {
      cancelEditBtn.addEventListener("click", () => {
        // Reset form to original values
        if (profile) {
          firstNameInput.value = profile.first_name || ""
          lastNameInput.value = profile.last_name || ""
        }

        // Disable form fields
        firstNameInput.disabled = true
        lastNameInput.disabled = true

        // Hide form actions
        profileActions.style.display = "none"
        // Show edit button
        editProfileBtn.style.display = "block"
      })
    }

    // Handle form submission
    if (profileForm) {
      profileForm.addEventListener("submit", async (e) => {
        e.preventDefault()

        try {
          const updatedProfile = {
            first_name: firstNameInput.value,
            last_name: lastNameInput.value,
          }

          // Update profile in Supabase
          const { error: updateError } = await supabaseClient.from("users").update(updatedProfile).eq("id", userId)

          if (updateError) {
            throw updateError
          }

          // Also update user metadata in auth
          const { error: authUpdateError } = await supabaseClient.auth.updateUser({
            data: {
              first_name: firstNameInput.value,
              last_name: lastNameInput.value,
            },
          })

          if (authUpdateError) {
            console.error("Error updating auth metadata:", authUpdateError)
          }

          // Disable form fields
          firstNameInput.disabled = true
          lastNameInput.disabled = true

          // Hide form actions
          profileActions.style.display = "none"
          // Show edit button
          editProfileBtn.style.display = "block"

          alert("Profile updated successfully!")
        } catch (error) {
          console.error("Error updating profile:", error)
          alert("Error updating profile. Please try again.")
        }
      })
    }
  } catch (error) {
    console.error("Error fetching profile:", error)
    loadingIndicator.style.display = "none"

    // Show error message
    profileContent.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        <p>There was an error loading your profile. Please try again later.</p>
      </div>
    `
    profileContent.style.display = "block"
  }
})
