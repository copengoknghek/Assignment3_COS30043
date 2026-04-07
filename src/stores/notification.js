import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])

  function remove(id) {
    notifications.value = notifications.value.filter((item) => item.id !== id)
  }

  function push(message, type = 'info', timeout = 2500) {
    const id = Date.now() + Math.random()
    notifications.value.push({ id, message, type })

    if (timeout > 0) {
      setTimeout(() => remove(id), timeout)
    }
  }

  function success(message, timeout = 2500) {
    push(message, 'success', timeout)
  }

  function info(message, timeout = 2500) {
    push(message, 'info', timeout)
  }

  function error(message, timeout = 2500) {
    push(message, 'error', timeout)
  }

  return {
    notifications,
    remove,
    push,
    success,
    info,
    error,
  }
})
