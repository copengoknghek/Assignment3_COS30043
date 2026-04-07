<template>
  <div class="toast-container position-fixed top-0 end-0 p-3">
    <TransitionGroup name="toast" tag="div" class="d-grid gap-2">
      <div
        v-for="note in notificationStore.notifications"
        :key="note.id"
        class="toast-notice shadow-sm"
        :class="`toast-${note.type}`"
      >
        <div class="d-flex align-items-start justify-content-between gap-2">
          <p class="mb-0 small fw-semibold">{{ note.message }}</p>
          <button
            class="btn-close btn-close-white btn-sm"
            type="button"
            aria-label="Close"
            @click="notificationStore.remove(note.id)"
          ></button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useNotificationStore } from '../stores/notification'

const notificationStore = useNotificationStore()
</script>

<style scoped>
.toast-container {
  z-index: 1080;
}

.toast-notice {
  min-width: 280px;
  max-width: 360px;
  padding: 0.75rem 0.9rem;
  border-radius: 12px;
  color: #ffffff;
  border: 1px solid transparent;
}

.toast-success {
  background: #e91e63;
  border-color: #c2185b;
}

.toast-info {
  background: #ff4f8b;
  border-color: #e93d7d;
}

.toast-error {
  background: #ad1457;
  border-color: #880e4f;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
