<template>
  <section>
    <h1 class="h2 mb-3">Fashion API</h1>
    <p class="text-muted mb-4">Live women’s fashion items from an external API with search, filtering, and pagination.</p>

    <div class="card p-3 mb-4">
      <div class="row g-3">
        <div class="col-12 col-md-6">
          <input
            v-focus
            v-model="searchQuery"
            type="text"
            class="form-control"
            placeholder="Search by title, brand, or category..."
          />
        </div>
        <div class="col-12 col-md-3">
          <select v-model="selectedCategory" class="form-select">
            <option value="">All categories</option>
            <option v-for="category in uniqueCategories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        <div class="col-12 col-md-3">
          <button class="btn btn-outline-secondary w-100" @click="loadFashionItems" :disabled="loading">
            {{ loading ? 'Loading...' : 'Refresh' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div v-else>
      <p class="text-muted mb-3">Showing {{ paginatedItems.length }} of {{ filteredItems.length }} items</p>

      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 align-items-stretch g-4 mb-4">
        <div v-for="item in paginatedItems" :key="item.id" class="col">
          <div class="card h-100 fashion-card">
            <div class="fashion-image-wrap">
              <img :src="item.thumbnail" :alt="item.title" class="img-fluid fashion-image" />
            </div>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">{{ item.title }}</h5>
              <p class="card-text small mb-2">
                <strong>Brand:</strong> {{ item.brand || 'N/A' }}<br />
                <strong>Category:</strong> {{ item.category }}<br />
                <strong>Price:</strong> ${{ Number(item.price).toFixed(2) }}<br />
                <strong>Rating:</strong> {{ item.rating }} / 5
              </p>
              <p class="card-text small text-body-secondary">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <nav v-if="totalPages > 1" aria-label="Page navigation" class="mt-4">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="currentPage--" :disabled="currentPage === 1">Previous</button>
          </li>
          <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
            <button class="page-link" @click="currentPage = page">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="currentPage++" :disabled="currentPage === totalPages">Next</button>
          </li>
        </ul>
      </nav>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const fashionItems = ref([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)
const itemsPerPage = 9

const API_URL = 'https://dummyjson.com/products?limit=0'

const DEMO_ITEMS = [
  { id: 1, title: 'Floral Summer Dress', brand: 'A-Line Studio', category: 'womens-dresses', price: 64.99, rating: 4.6, thumbnail: 'https://i.imgur.com/0KFBHTB.jpg', description: 'Lightweight floral dress for warm-weather styling.' },
  { id: 2, title: 'Elegant Midi Dress', brand: 'Maison Belle', category: 'womens-dresses', price: 89.0, rating: 4.8, thumbnail: 'https://i.imgur.com/QkIa5tT.jpeg', description: 'Sleek midi dress with a clean silhouette for day or night.' },
  { id: 3, title: 'Tailored Blazer', brand: 'Chan Edit', category: 'tops', price: 109.0, rating: 4.7, thumbnail: 'https://i.imgur.com/1h7pZ8Z.jpg', description: 'A sharp blazer that works with skirts, trousers, or denim.' },
  { id: 4, title: 'Classic Handbag', brand: 'Luxe Carry', category: 'womens-bags', price: 74.5, rating: 4.5, thumbnail: 'https://i.imgur.com/9a8Qe6B.jpg', description: 'Structured bag with polished hardware and versatile wear.' },
  { id: 5, title: 'Block Heel Sandals', brand: 'Step Chic', category: 'womens-shoes', price: 59.99, rating: 4.4, thumbnail: 'https://i.imgur.com/Z1w2F6q.jpg', description: 'Comfortable heels designed for all-day wear.' },
  { id: 6, title: 'Silk Wrap Top', brand: 'Satin Lane', category: 'tops', price: 48.0, rating: 4.3, thumbnail: 'https://i.imgur.com/V1ypU1S.jpg', description: 'Soft wrap top with a premium drape for styling flexibility.' },
  { id: 7, title: 'Pleated Skirt', brand: 'Velour Row', category: 'skirts', price: 52.0, rating: 4.6, thumbnail: 'https://i.imgur.com/8zQZQ2g.jpg', description: 'Fluid pleated skirt with a flattering mid-length cut.' },
  { id: 8, title: 'Minimal Tote Bag', brand: 'Urban Carry', category: 'womens-bags', price: 45.0, rating: 4.2, thumbnail: 'https://i.imgur.com/2G8c0tA.jpg', description: 'Everyday tote with clean lines and practical space.' },
  { id: 9, title: 'Evening Clutch', brand: 'Noir Atelier', category: 'womens-bags', price: 39.0, rating: 4.7, thumbnail: 'https://i.imgur.com/6Y4rF8o.jpg', description: 'Compact clutch made for special occasions.' },
  { id: 10, title: 'Pointed Toe Flats', brand: 'Soft Step', category: 'womens-shoes', price: 54.0, rating: 4.5, thumbnail: 'https://i.imgur.com/4QfKuz1.jpg', description: 'Slim profile flats that pair well with tailored looks.' },
  { id: 11, title: 'Ribbed Knit Top', brand: 'Mode Form', category: 'tops', price: 36.5, rating: 4.4, thumbnail: 'https://i.imgur.com/Z2nGqX6.jpg', description: 'Simple ribbed knit top with a flattering stretch fit.' },
  { id: 12, title: 'Wide-Leg Trousers', brand: 'Studio Fit', category: 'womens-dresses', price: 69.0, rating: 4.6, thumbnail: 'https://i.imgur.com/PrvJ6gD.jpg', description: 'Flowing trousers for a polished, modern wardrobe.' },
]

async function loadFashionItems() {
  loading.value = true
  error.value = ''
  try {
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`)
    }
    const data = await response.json()
    if (!Array.isArray(data.products)) {
      throw new Error('Invalid data format received')
    }
    fashionItems.value = data.products
      .filter((item) => ['womens-dresses', 'womens-shoes', 'womens-bags', 'tops', 'skirts'].includes(item.category))
      .map((item) => ({
        id: item.id,
        title: item.title,
        brand: item.brand,
        category: item.category,
        price: item.price,
        rating: item.rating,
        thumbnail: item.thumbnail,
        description: item.description,
      }))
      .sort((a, b) => a.title.localeCompare(b.title))
  } catch (err) {
    console.warn('Failed to fetch from API, using demo fashion data:', err)
    fashionItems.value = DEMO_ITEMS
    error.value = ''
  } finally {
    loading.value = false
    currentPage.value = 1
  }
}

const uniqueCategories = computed(() => {
  const categories = new Set(fashionItems.value.map((item) => item.category))
  return Array.from(categories).sort()
})

const filteredItems = computed(() => {
  return fashionItems.value.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (item.brand && item.brand.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      item.category.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !selectedCategory.value || item.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage))

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredItems.value.slice(start, start + itemsPerPage)
})

watch([searchQuery, selectedCategory], () => {
  currentPage.value = 1
})

onMounted(() => {
  loadFashionItems()
})
</script>

<style scoped>
.fashion-card {
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border-color: var(--border);
}

.fashion-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.fashion-image-wrap {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: #f5f5f5;
}

.fashion-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

:root[data-theme='dark'] .fashion-card {
  background: #000000;
  border-color: #3a3a3a;
}

:root[data-theme='dark'] .fashion-card .card-title,
:root[data-theme='dark'] .fashion-card .card-text,
:root[data-theme='dark'] .fashion-card strong {
  color: #ffffff !important;
}

:root[data-theme='dark'] .fashion-image-wrap {
  background: #1a1a1a;
}
</style>