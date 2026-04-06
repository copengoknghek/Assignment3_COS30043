import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { initialProducts } from '../data/products'

const PRODUCTS_KEY = 'mini-shop-products'

function getSavedProducts() {
  const raw = localStorage.getItem(PRODUCTS_KEY)
  if (!raw) return initialProducts

  const savedProducts = JSON.parse(raw)
  const missingDefaults = initialProducts.filter(
    (defaultItem) => !savedProducts.some((savedItem) => savedItem.id === defaultItem.id),
  )

  const mergedProducts = [...missingDefaults, ...savedProducts]
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(mergedProducts))

  return mergedProducts
}

export const useProductStore = defineStore('products', () => {
  const products = ref(getSavedProducts())

  const categories = computed(() => {
    const unique = new Set(products.value.map((product) => product.category))
    return ['All', ...Array.from(unique)]
  })

  function persistProducts() {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products.value))
  }

  function getById(id) {
    return products.value.find((item) => item.id === Number(id)) || null
  }

  function addProduct(payload) {
    const newProduct = {
      id: Date.now(),
      name: payload.name.trim(),
      price: Number(payload.price),
      category: payload.category.trim(),
      image: payload.image.trim(),
      description: payload.description.trim(),
      likes: 0,
      likedBy: [],
    }

    products.value.unshift(newProduct)
    persistProducts()
  }

  function updateProduct(id, payload) {
    const index = products.value.findIndex((item) => item.id === Number(id))
    if (index === -1) return

    products.value[index] = {
      ...products.value[index],
      name: payload.name.trim(),
      price: Number(payload.price),
      category: payload.category.trim(),
      image: payload.image.trim(),
      description: payload.description.trim(),
    }

    persistProducts()
  }

  function deleteProduct(id) {
    products.value = products.value.filter((item) => item.id !== Number(id))
    persistProducts()
  }

  function toggleLike(productId, userEmail) {
    const product = getById(productId)
    if (!product || !userEmail) return

    const liked = product.likedBy.includes(userEmail)
    if (liked) {
      product.likedBy = product.likedBy.filter((email) => email !== userEmail)
      product.likes = Math.max(0, product.likes - 1)
    } else {
      product.likedBy.push(userEmail)
      product.likes += 1
    }

    persistProducts()
  }

  return {
    products,
    categories,
    getById,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleLike,
  }
})
