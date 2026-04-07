<template>
  <div class="app-shell">
    <AppNavbar />
    <main class="container py-4">
      <RouterView />
    </main>
    <GlobalLikeBurst />
    <AppToast />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import AppNavbar from './components/Navbar.vue'
import GlobalLikeBurst from './components/GlobalLikeBurst.vue'
import AppToast from './components/AppToast.vue'
</script>
