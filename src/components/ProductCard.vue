<template>
  <div class="card product-card h-100">
    <img :src="product.image" class="card-img-top product-image" :alt="product.name" />

    <div class="card-body d-flex flex-column">
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
      <button class="btn btn-outline-danger btn-sm" @click="emit('like', product)">Like</button>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['add', 'like'])
</script>
