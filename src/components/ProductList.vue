<template>
  <div class="row g-4">
    <div
      v-for="product in products"
      :key="product.id"
      class="col-12 col-md-6 col-lg-4 col-xl-3"
    >
      <ProductCard :product="product" @add="emit('add', $event)" @like="emit('like', $event)" />
    </div>
  </div>
</template>

<script setup>
import ProductCard from './ProductCard.vue'

defineProps({
  products: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['add', 'like'])
</script>
