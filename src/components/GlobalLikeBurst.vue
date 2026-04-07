<template>
  <div class="global-like-overlay" aria-hidden="true">
    <TransitionGroup name="heart-pop" tag="div">
      <span
        v-for="heart in hearts"
        :key="heart.id"
        class="global-heart"
        :style="{
          left: `${heart.x}vw`,
          top: `${heart.y}vh`,
          fontSize: `${heart.size}px`,
          animationDuration: `${heart.duration}ms`,
          animationDelay: `${heart.delay}ms`,
          color: heart.color,
        }"
      >❤</span>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useEffectsStore } from '../stores/effects'

const effectsStore = useEffectsStore()
const hearts = ref([])

function randomIn(min, max) {
  return Math.random() * (max - min) + min
}

function triggerGlobalBurst() {
  const palette = ['#e91e63', '#ff4f8b', '#ff78a7', '#ffc1d6']
  const created = Array.from({ length: 26 }, (_, index) => ({
    id: `${Date.now()}-${index}-${Math.random()}`,
    x: randomIn(8, 92),
    y: randomIn(20, 88),
    size: randomIn(20, 42),
    duration: randomIn(700, 1200),
    delay: randomIn(0, 180),
    color: palette[Math.floor(Math.random() * palette.length)],
  }))

  hearts.value = created

  setTimeout(() => {
    hearts.value = []
  }, 1500)
}

watch(
  () => effectsStore.likeBurstTick,
  () => {
    triggerGlobalBurst()
  },
)
</script>

<style scoped>
.global-like-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1070;
  overflow: hidden;
}

.global-heart {
  position: absolute;
  opacity: 0;
  filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.2));
  transform: translate(-50%, -50%) scale(0.7) rotate(0deg);
  animation-name: float-heart;
  animation-timing-function: ease-out;
  animation-fill-mode: forwards;
}

@keyframes float-heart {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.7) rotate(0deg);
  }
  20% {
    opacity: 0.95;
  }
  100% {
    opacity: 0;
    transform: translate(calc(-50% + 8px), calc(-50% - 90px)) scale(1.25) rotate(18deg);
  }
}
</style>
