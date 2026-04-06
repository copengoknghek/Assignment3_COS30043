<template>
  <div class="search-card p-3 p-md-4 mb-4">
    <div class="row g-3 align-items-end">
      <div class="col-12 col-md-6 col-lg-5">
        <label class="form-label">Search by name</label>
        <input
          v-focus
          v-model="localSearch"
          type="text"
          class="form-control"
          placeholder="Search products..."
          @input="emit('update:search', localSearch)"
        />
      </div>

      <div class="col-12 col-md-3 col-lg-3">
        <label class="form-label">Category</label>
        <select
          v-model="localCategory"
          class="form-select"
          @change="emit('update:category', localCategory)"
        >
          <option v-for="option in categories" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>

      <div class="col-12 col-md-3 col-lg-2">
        <label class="form-label">Min Price</label>
        <input
          v-model.number="localMinPrice"
          type="number"
          min="0"
          class="form-control"
          @input="emit('update:minPrice', localMinPrice || 0)"
        />
      </div>

      <div class="col-12 col-md-3 col-lg-2">
        <label class="form-label">Max Price</label>
        <input
          v-model.number="localMaxPrice"
          type="number"
          min="0"
          class="form-control"
          @input="emit('update:maxPrice', localMaxPrice || 0)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  search: { type: String, default: '' },
  category: { type: String, default: 'All' },
  minPrice: { type: Number, default: 0 },
  maxPrice: { type: Number, default: 0 },
  categories: { type: Array, default: () => ['All'] },
})

const emit = defineEmits([
  'update:search',
  'update:category',
  'update:minPrice',
  'update:maxPrice',
])

const localSearch = ref(props.search)
const localCategory = ref(props.category)
const localMinPrice = ref(props.minPrice)
const localMaxPrice = ref(props.maxPrice)

watch(
  () => props.search,
  (value) => {
    localSearch.value = value
  },
)

watch(
  () => props.category,
  (value) => {
    localCategory.value = value
  },
)
</script>
