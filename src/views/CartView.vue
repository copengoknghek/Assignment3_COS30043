<template>
  <section>
    <h1 class="h2 mb-3">Your Cart</h1>

    <div v-if="!cartStore.items.length" class="alert alert-warning">Your cart is empty.</div>

    <template v-else>
      <CartItem
        v-for="item in cartStore.items"
        :key="item.id"
        :item="item"
        @update-qty="handleQty"
        @remove="cartStore.removeFromCart"
      />

      <div class="cart-summary card p-3 mt-3">
        <p class="mb-1">Items: {{ cartStore.totalItems }}</p>
        <h5 class="mb-2">Total: ${{ cartStore.totalPrice.toFixed(2) }}</h5>
        <button class="btn btn-success" @click="handleCheckout">Checkout</button>
      </div>
    </template>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import CartItem from '../components/CartItem.vue'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'

const authStore = useAuthStore()
const cartStore = useCartStore()

onMounted(() => {
  cartStore.setActiveUser(authStore.currentUser?.email)
})

function handleQty({ id, quantity }) {
  cartStore.updateQuantity(id, quantity)
}

function handleCheckout() {
  alert('Checkout success! (Demo)')
  cartStore.clearCart()
}
</script>
