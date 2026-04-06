<template>
  <div class="app-shell">
    <AppNavbar />
    <main class="container py-4">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import AppNavbar from './components/Navbar.vue'
</script>
