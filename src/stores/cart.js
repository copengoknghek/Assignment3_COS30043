import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

const CARTS_KEY = 'mini-shop-carts-by-user'

function getAllCarts() {
  const raw = localStorage.getItem(CARTS_KEY)
  return raw ? JSON.parse(raw) : {}
}

export const useCartStore = defineStore('cart', () => {
  const cartsByUser = ref(getAllCarts())
  const activeEmail = ref('guest')

  const items = computed(() => cartsByUser.value[activeEmail.value] || [])
  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
  )
  const totalPrice = computed(() =>
    items.value.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0,
    ),
  )

  watch(
    cartsByUser,
    (value) => {
      localStorage.setItem(CARTS_KEY, JSON.stringify(value))
    },
    { deep: true },
  )

  function setActiveUser(email) {
    activeEmail.value = email || 'guest'
    if (!cartsByUser.value[activeEmail.value]) {
      cartsByUser.value[activeEmail.value] = []
    }
  }

  function addToCart(product) {
    const userCart = cartsByUser.value[activeEmail.value] || []
    const existed = userCart.find((item) => item.id === product.id)

    if (existed) {
      existed.quantity += 1
      cartsByUser.value[activeEmail.value] = userCart
      return { status: 'exists', quantity: existed.quantity }
    } else {
      userCart.push({
        id: product.id,
        name: product.name,
        price: Number(product.price || 0),
        image: product.image,
        quantity: 1,
      })
      cartsByUser.value[activeEmail.value] = userCart
      return { status: 'added', quantity: 1 }
    }
  }

  function updateQuantity(productId, quantity) {
    const userCart = cartsByUser.value[activeEmail.value] || []
    const target = userCart.find((item) => item.id === productId)
    if (!target) return

    const safeQty = Math.max(1, Number(quantity))
    target.quantity = safeQty
  }

  function removeFromCart(productId) {
    const userCart = cartsByUser.value[activeEmail.value] || []
    cartsByUser.value[activeEmail.value] = userCart.filter((item) => item.id !== productId)
  }

  function clearCart() {
    cartsByUser.value[activeEmail.value] = []
  }

  return {
    items,
    totalItems,
    totalPrice,
    setActiveUser,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  }
})
