<template>
  <div v-if="product">
    <section class="row g-4 mb-5">
      <div class="col-12 col-lg-6">
        <img :src="product.image" :alt="product.name" class="detail-image" />
      </div>

      <div class="col-12 col-lg-6">
        <span class="badge text-bg-secondary mb-2">{{ product.category }}</span>
        <h1 class="h2">{{ product.name }}</h1>
        <p class="text-body-secondary mb-3">{{ product.description }}</p>
        <p class="h4 mb-2">${{ Number(product.price).toFixed(2) }}</p>
        <p class="mb-4">❤️ {{ product.likes }} likes</p>

        <div class="d-flex gap-2 flex-wrap">
          <button class="btn btn-primary" @click="handleAdd">Add to cart</button>
          <button class="btn btn-outline-danger" @click="handleLike">Like</button>
          <RouterLink class="btn btn-outline-dark" to="/products">Back to products</RouterLink>
        </div>
      </div>
    </section>

    <section>
      <h2 class="h5 mb-3">You may also like</h2>
      <ProductList :products="related" @add="handleAdd" @like="handleLike" />
    </section>
  </div>

  <div v-else class="alert alert-danger">Product not found.</div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import ProductList from '../components/ProductList.vue'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useNotificationStore } from '../stores/notification'
import { useProductStore } from '../stores/product'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const notificationStore = useNotificationStore()
const productStore = useProductStore()

const product = computed(() => productStore.getById(route.params.id))
const related = computed(() => {
  if (!product.value) return []

  return productStore.products
    .filter((item) => item.id !== product.value.id && item.category === product.value.category)
    .slice(0, 4)
})

function handleAdd(selectedProduct) {
  const targetProduct = selectedProduct || product.value

  if (!authStore.isAuthenticated || !targetProduct) {
    notificationStore.info('Please login first to add items to cart.')
    router.push('/login')
    return
  }

  cartStore.setActiveUser(authStore.currentUser?.email)
  const result = cartStore.addToCart(targetProduct)
  if (result?.status === 'exists') {
    notificationStore.info(`${targetProduct.name} is already in your cart. Quantity: ${result.quantity}`)
  } else {
    notificationStore.success(`${targetProduct.name} added to cart.`)
  }
}

function handleLike() {
  if (!authStore.isAuthenticated || !product.value) {
    router.push('/login')
    return
  }

  productStore.toggleLike(product.value.id, authStore.currentUser?.email)
}
</script>
