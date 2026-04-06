<template>
  <section class="hero-wrap p-4 p-md-5 mb-4">
    <div class="row align-items-center g-4">
      <div class="col-12 col-lg-7">
        <p class="text-uppercase small mb-2 hero-kicker">Chan Women's Fashion</p>
        <h1 class="display-5 fw-bold mb-3">Style every day with Chan.</h1>
        <p class="lead mb-4">
          Shop women clothes, shoes, bags and accessories with quick search, smart filters and easy
          checkout.
        </p>
        <div class="d-flex flex-wrap gap-2">
          <RouterLink class="btn btn-primary" to="/products">Shop Now</RouterLink>
          <RouterLink class="btn btn-outline-dark" to="/admin">Manage Products</RouterLink>
        </div>
      </div>
      <div class="col-12 col-lg-5">
        <div class="hero-stat-grid">
          <div class="stat-card">
            <h3>{{ productStore.products.length }}+</h3>
            <p>Products ready</p>
          </div>
          <div class="stat-card">
            <h3>100%</h3>
            <p>Responsive layout</p>
          </div>
          <div class="stat-card">
            <h3>Auth</h3>
            <p>Login/Register flow</p>
          </div>
          <div class="stat-card">
            <h3>CRUD</h3>
            <p>Admin operations</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section>
    <h2 class="h4 mb-3">You may also like</h2>
    <ProductList :products="featured" @add="handleAdd" @like="handleLike" />
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import ProductList from '../components/ProductList.vue'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useProductStore } from '../stores/product'

const authStore = useAuthStore()
const cartStore = useCartStore()
const productStore = useProductStore()
const router = useRouter()

const featured = computed(() => productStore.products.slice(0, 4))

function handleAdd(product) {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  cartStore.setActiveUser(authStore.currentUser?.email)
  cartStore.addToCart(product)
}

function handleLike(product) {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  productStore.toggleLike(product.id, authStore.currentUser?.email)
}
</script>
