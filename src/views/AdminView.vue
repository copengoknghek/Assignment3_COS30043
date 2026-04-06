<template>
  <section>
    <h1 class="h2 mb-3">Admin - Product CRUD</h1>

    <div class="card p-3 p-md-4 mb-4">
      <h2 class="h5 mb-3">{{ editingId ? 'Edit product' : 'Add product' }}</h2>

      <form class="row g-3" @submit.prevent="handleSubmit">
        <div class="col-12 col-md-6">
          <label class="form-label">Name</label>
          <input v-model="form.name" type="text" class="form-control" required />
        </div>

        <div class="col-12 col-md-3">
          <label class="form-label">Price</label>
          <input v-model.number="form.price" type="number" min="0" step="0.01" class="form-control" required />
        </div>

        <div class="col-12 col-md-3">
          <label class="form-label">Category</label>
          <input v-model="form.category" type="text" class="form-control" required />
        </div>

        <div class="col-12">
          <label class="form-label">Image URL</label>
          <input v-model="form.image" type="url" class="form-control" required />
        </div>

        <div class="col-12">
          <label class="form-label">Description</label>
          <textarea v-model="form.description" rows="3" class="form-control" required></textarea>
        </div>

        <div class="col-12 d-flex gap-2">
          <button type="submit" class="btn btn-primary">
            {{ editingId ? 'Update product' : 'Add product' }}
          </button>
          <button v-if="editingId" type="button" class="btn btn-outline-secondary" @click="resetForm">
            Cancel edit
          </button>
        </div>
      </form>
    </div>

    <div class="table-responsive">
      <table class="table table-striped align-middle">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Category</th>
            <th scope="col">Price</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in productStore.products" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.category }}</td>
            <td>${{ Number(item.price).toFixed(2) }}</td>
            <td class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-primary" @click="startEdit(item)">Edit</button>
              <button class="btn btn-sm btn-outline-danger" @click="removeProduct(item.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useProductStore } from '../stores/product'

const productStore = useProductStore()

const editingId = ref(null)
const form = reactive({
  name: '',
  price: 0,
  category: '',
  image: '',
  description: '',
})

function resetForm() {
  editingId.value = null
  form.name = ''
  form.price = 0
  form.category = ''
  form.image = ''
  form.description = ''
}

function handleSubmit() {
  const payload = {
    name: form.name,
    price: form.price,
    category: form.category,
    image: form.image,
    description: form.description,
  }

  if (editingId.value) {
    productStore.updateProduct(editingId.value, payload)
  } else {
    productStore.addProduct(payload)
  }

  resetForm()
}

function startEdit(item) {
  editingId.value = item.id
  form.name = item.name
  form.price = item.price
  form.category = item.category
  form.image = item.image
  form.description = item.description
}

function removeProduct(id) {
  const confirmed = confirm('Delete this product?')
  if (!confirmed) return

  productStore.deleteProduct(id)
}
</script>
