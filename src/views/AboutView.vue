<template>
  <section>
    <h1 class="h2 mb-3">About Chan</h1>
    <p class="mb-4 text-body-secondary">
      Chan is a women fashion mini shop built with Vue 3. This page introduces the app and lets
      users personalize a welcome preview.
    </p>

    <div class="row g-4 align-items-start">
      <div class="col-12 col-md-6">
        <div class="card p-3 p-md-4">
          <h2 class="h5 mb-3">Personal Introduction</h2>

          <div class="mb-3">
            <label for="about-first-name" class="form-label">First name</label>
            <input
              id="about-first-name"
              v-model="firstName"
              type="text"
              class="form-control"
              placeholder="Enter first name"
            />
          </div>

          <div class="mb-3">
            <label for="about-last-name" class="form-label">Last name</label>
            <input
              id="about-last-name"
              v-model="lastName"
              type="text"
              class="form-control"
              placeholder="Enter last name"
            />
          </div>

          <p class="fw-semibold mb-3">Hello, {{ displayName }}!</p>

          <fieldset>
            <legend class="form-label mb-2">Choose your fashion preference</legend>
            <div class="form-check">
              <input
                id="style-casual"
                v-model="selectedStyle"
                class="form-check-input"
                type="radio"
                name="style-choice"
                value="casual"
              />
              <label for="style-casual" class="form-check-label">Casual</label>
            </div>
            <div class="form-check">
              <input
                id="style-party"
                v-model="selectedStyle"
                class="form-check-input"
                type="radio"
                name="style-choice"
                value="party"
              />
              <label for="style-party" class="form-check-label">Party</label>
            </div>
          </fieldset>
        </div>
      </div>

      <div class="col-12 col-md-6">
        <div class="card p-3 p-md-4">
          <h2 class="h5 mb-3">Outfit Preview</h2>

          <img
            v-if="selectedStyle === 'casual'"
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"
            alt="Casual outfit"
            class="about-preview-img"
          />
          <img
            v-show="selectedStyle === 'party'"
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80"
            alt="Party outfit"
            class="about-preview-img"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const selectedStyle = ref('casual')
const profile = authStore.currentUser || authStore.lastRegisteredUser
const firstName = ref(profile?.firstName || profile?.name?.split(' ')?.[0] || 'Guest')
const lastName = ref(profile?.lastName || profile?.name?.split(' ')?.slice(1).join(' ') || 'User')

const displayName = computed(() => {
  const full = `${firstName.value} ${lastName.value}`.trim()
  return full || 'Guest User'
})
</script>
