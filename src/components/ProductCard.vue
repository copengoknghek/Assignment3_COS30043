<template>
  <div class="card product-card h-100">
    <img :src="product.image" class="card-img-top product-image" :alt="product.name" />

    <div class="card-body d-flex flex-column" :class="{ 'liked-bg': isLikedByUser }">
      <span class="badge text-bg-secondary mb-2 w-fit">{{ product.category }}</span>
      <h5 class="card-title">{{ product.name }}</h5>
      <p class="card-text small text-body-secondary mb-3">{{ product.description }}</p>

      <div class="mt-auto d-flex align-items-center justify-content-between">
        <strong>${{ Number(product.price).toFixed(2) }}</strong>
        <span class="small">❤️ {{ product.likes }}</span>
      </div>
    </div>

    <div class="card-footer bg-transparent border-0 pt-0 d-grid gap-2">
      <RouterLink :to="`/product/${product.id}`" class="btn btn-outline-dark btn-sm">
        View detail
      </RouterLink>

      <button class="btn btn-primary btn-sm" @click="emit('add', product)">Add to cart</button>
      <button
        class="btn btn-sm"
        :class="isLikedByUser ? 'btn-danger' : 'btn-outline-danger'"
        @click="handleLikeClick"
      >
        {{ isLikedByUser ? 'Liked' : 'Like' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useEffectsStore } from '../stores/effects'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['add', 'like'])
const authStore = useAuthStore()
const effectsStore = useEffectsStore()

const isLikedByUser = computed(() => {
  const email = authStore.currentUser?.email
  if (!email || !Array.isArray(props.product.likedBy)) return false
  return props.product.likedBy.includes(email)
})

function handleLikeClick() {
  emit('like', props.product)
  effectsStore.triggerLikeBurst()
}
</script>

<style scoped>
.liked-bg {
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

.liked-bg::before,
.liked-bg::after {
  position: absolute;
  color: rgba(233, 30, 99, 0.14);
  line-height: 1;
  z-index: 0;
  pointer-events: none;
}

.liked-bg::before {
  content: '❤';
  right: 8px;
  bottom: 4px;
  font-size: 5.2rem;
  transform: rotate(-12deg);
}

.liked-bg::after {
  content: '❤ ❤';
  left: 8px;
  top: 8px;
  font-size: 1.4rem;
  letter-spacing: 8px;
  transform: rotate(-8deg);
}

.liked-bg > * {
  position: relative;
  z-index: 1;
}

:root[data-theme='dark'] .liked-bg::before,
:root[data-theme='dark'] .liked-bg::after {
  color: rgba(255, 79, 139, 0.32);
}
</style>
