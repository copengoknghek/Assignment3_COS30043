<template>
  <nav class="navbar navbar-expand-lg app-navbar mb-4">
    <div class="container-fluid">
      <RouterLink to="/" class="navbar-brand fw-bold d-flex align-items-center">
        <img :src="currentLogo" alt="Chan" class="brand-logo" />
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNav"
        aria-controls="mainNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="mainNav" class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/about">About</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/products">Products</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/fashion">Fashion API</RouterLink>
          </li>
          <li class="nav-item" v-if="isAuthenticated">
            <RouterLink class="nav-link" to="/cart">Cart ({{ cartCount }})</RouterLink>
          </li>
          <li class="nav-item" v-if="isAdmin">
            <RouterLink class="nav-link" to="/admin">Admin</RouterLink>
          </li>
        </ul>

        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-sm btn-outline-secondary" @click="uiStore.toggleTheme">
            {{ uiStore.isDark ? 'Light mode' : 'Dark mode' }}
          </button>

          <template v-if="isAuthenticated">
            <span class="small text-body-secondary">Hi, {{ greetingName }}</span>
            <button class="btn btn-sm btn-danger" @click="handleLogout">Logout</button>
          </template>

          <RouterLink v-else class="btn btn-sm btn-primary" to="/login">Login</RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useUiStore } from '../stores/ui'
import chanDarkLogo from '../assets/chan.png'
import chanLightLogo from '../assets/chanlight.png'

const authStore = useAuthStore()
const cartStore = useCartStore()
const uiStore = useUiStore()
const router = useRouter()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const cartCount = computed(() =>
  cartStore.items.reduce((sum, item) => sum + item.quantity, 0),
)
const currentLogo = computed(() => (uiStore.isDark ? chanDarkLogo : chanLightLogo))
const greetingName = computed(() => {
  const first = authStore.currentUser?.firstName || ''
  const last = authStore.currentUser?.lastName || ''
  const fullName = `${first} ${last}`.trim()
  return fullName || authStore.currentUser?.name || 'User'
})

watch(
  () => authStore.currentUser?.email,
  (email) => {
    cartStore.setActiveUser(email)
  },
  { immediate: true },
)

function handleLogout() {
  authStore.logout()
  cartStore.setActiveUser('guest')
  router.push('/login')
}
</script>
