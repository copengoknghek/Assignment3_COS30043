import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

const THEME_KEY = 'mini-shop-theme'

export const useUiStore = defineStore('ui', () => {
  const isDark = ref(localStorage.getItem(THEME_KEY) === 'dark')

  watch(
    isDark,
    (value) => {
      const root = document.documentElement
      root.setAttribute('data-theme', value ? 'dark' : 'light')
      localStorage.setItem(THEME_KEY, value ? 'dark' : 'light')
    },
    { immediate: true },
  )

  function toggleTheme() {
    isDark.value = !isDark.value
  }

  return {
    isDark,
    toggleTheme,
  }
})
