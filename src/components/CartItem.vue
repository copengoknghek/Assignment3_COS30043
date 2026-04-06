<template>
  <div class="card mb-3">
    <div class="row g-0 align-items-center">
      <div class="col-4 col-md-2">
        <img :src="item.image" :alt="item.name" class="img-fluid rounded-start cart-thumb" />
      </div>
      <div class="col-8 col-md-10">
        <div class="card-body d-flex flex-column flex-md-row justify-content-between gap-3">
          <div>
            <h6 class="card-title mb-1">{{ item.name }}</h6>
            <p class="small text-body-secondary mb-0">${{ Number(item.price).toFixed(2) }} each</p>
          </div>

          <div class="d-flex align-items-center gap-2">
            <input
              :value="item.quantity"
              type="number"
              min="1"
              class="form-control form-control-sm qty-input"
              @input="onInput"
            />
            <button class="btn btn-sm btn-outline-danger" @click="emit('remove', item.id)">
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update-qty', 'remove'])

function onInput(event) {
  emit('update-qty', {
    id: props.item.id,
    quantity: Number(event.target.value),
  })
}
</script>
