<template>
  <section>
    <h1 class="h2 mb-3">Products</h1>

    <SearchBar
      :search="search"
      :category="category"
      :min-price="minPrice"
      :max-price="maxPrice"
      :categories="productStore.categories"
      @update:search="search = $event"
      @update:category="category = $event"
      @update:min-price="minPrice = $event"
      @update:max-price="maxPrice = $event"
    />

    <LoadingSpinner v-if="loading" />

    <div v-else-if="!filteredProducts.length" class="alert alert-warning">
      No product found. Try different filters.
    </div>

    <template v-else>
      <ProductList
        :products="paginatedProducts"
        @add="handleAddToCart"
        @like="handleLike"
      />

      <nav class="mt-4" aria-label="Product pagination" v-if="totalPages > 1">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="prevPage" :disabled="currentPage === 1">
              Previous
            </button>
          </li>

          <li
            v-for="page in totalPages"
            :key="page"
            class="page-item"
            :class="{ active: page === currentPage }"
          >
            <button class="page-link" @click="goToPage(page)">{{ page }}</button>
          </li>

          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button
              class="page-link"
              @click="nextPage"
              :disabled="currentPage === totalPages"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import ProductList from '../components/ProductList.vue'
import SearchBar from '../components/SearchBar.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useNotificationStore } from '../stores/notification'
import { useProductStore } from '../stores/product'

const authStore = useAuthStore()
const cartStore = useCartStore()
const notificationStore = useNotificationStore()
const productStore = useProductStore()
const router = useRouter()

const loading = ref(true)
const search = ref('')
const category = ref('All')
const minPrice = ref(0)
const maxPrice = ref(0)
const currentPage = ref(1)
const itemsPerPage = ref(8)

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 500)
})

const filteredProducts = computed(() => {
  return productStore.products.filter((item) => {
    const matchName = item.name.toLowerCase().includes(search.value.toLowerCase().trim())
    const matchCategory = category.value === 'All' || item.category === category.value
    const matchMin = Number(item.price) >= Number(minPrice.value || 0)
    const matchMax = !maxPrice.value || Number(item.price) <= Number(maxPrice.value)
    return matchName && matchCategory && matchMin && matchMax
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredProducts.value.length / itemsPerPage.value)))
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProducts.value.slice(start, end)
})

watch([search, category, minPrice, maxPrice], () => {
  currentPage.value = 1
})

watch(totalPages, (pageCount) => {
  if (currentPage.value > pageCount) {
    currentPage.value = pageCount
  }
})

function goToPage(page) {
  currentPage.value = page
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value -= 1
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value += 1
}

function handleAddToCart(product) {
  if (!authStore.isAuthenticated) {
    notificationStore.info('Please login first to add items to cart.')
    router.push('/login')
    return
  }

  cartStore.setActiveUser(authStore.currentUser?.email)
  const result = cartStore.addToCart(product)
  if (result?.status === 'exists') {
    notificationStore.info(`${product.name} is already in your cart. Quantity: ${result.quantity}`)
  } else {
    notificationStore.success(`${product.name} added to cart.`)
  }
}

function handleLike(product) {
  if (!authStore.isAuthenticated) {
    alert('Please login first to like products.')
    router.push('/login')
    return
  }

  productStore.toggleLike(product.id, authStore.currentUser?.email)
}
</script>
