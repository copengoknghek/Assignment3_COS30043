import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useEffectsStore = defineStore('effects', () => {
  const likeBurstTick = ref(0)

  function triggerLikeBurst() {
    likeBurstTick.value += 1
  }

  return {
    likeBurstTick,
    triggerLikeBurst,
  }
})
