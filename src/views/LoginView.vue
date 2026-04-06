<template>
  <section class="row justify-content-center">
    <div class="col-12 col-md-8 col-lg-6">
      <div class="card p-4 auth-card">
        <h1 class="h3 mb-3">{{ isLoginMode ? 'Login' : 'Register' }}</h1>

        <form @submit.prevent="handleSubmit" class="d-grid gap-3">
          <div v-if="!isLoginMode">
            <label for="register-first-name" class="form-label">First name</label>
            <input
              id="register-first-name"
              v-model="form.firstName"
              type="text"
              class="form-control"
              required
              minlength="2"
              maxlength="30"
              placeholder="Enter first name"
            />
          </div>

          <div v-if="!isLoginMode">
            <label for="register-last-name" class="form-label">Last name</label>
            <input
              id="register-last-name"
              v-model="form.lastName"
              type="text"
              class="form-control"
              required
              minlength="2"
              maxlength="30"
              placeholder="Enter last name"
            />
            <small class="text-body-secondary">First and last name must be 2-30 characters.</small>
          </div>

          <div>
            <label for="auth-email" class="form-label">Email</label>
            <input
              id="auth-email"
              v-model="form.email"
              type="email"
              class="form-control"
              required
              placeholder="example@email.com"
            />
            <small class="text-body-secondary">Enter a valid email format.</small>
          </div>

          <div>
            <label for="auth-password" class="form-label">Password</label>
            <input
              id="auth-password"
              v-model="form.password"
              type="password"
              class="form-control"
              required
              minlength="8"
              maxlength="50"
              placeholder="Enter a strong password"
            />
            <small class="text-body-secondary"
              >Password must be at least 8 chars with 1 uppercase, 1 number, and 1 special
              character.</small
            >
          </div>

          <button class="btn btn-primary" type="submit">
            {{ isLoginMode ? 'Login' : 'Create account' }}
          </button>
        </form>

        <p v-if="errorMessage" class="text-danger mt-3 mb-0">{{ errorMessage }}</p>

        <button class="btn btn-link mt-3 p-0 text-start" @click="isLoginMode = !isLoginMode">
          {{ isLoginMode ? 'No account? Register now' : 'Already have account? Login' }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const isLoginMode = ref(true)
const errorMessage = ref('')
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
})

function validateForm() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

  if (!isLoginMode.value) {
    const firstName = form.firstName.trim()
    const lastName = form.lastName.trim()

    if (firstName.length < 2 || firstName.length > 30) {
      throw new Error('First name must be between 2 and 30 characters')
    }

    if (lastName.length < 2 || lastName.length > 30) {
      throw new Error('Last name must be between 2 and 30 characters')
    }
  }

  if (!emailRegex.test(form.email.trim())) {
    throw new Error('Please enter a valid email')
  }

  if (!passwordRegex.test(form.password)) {
    throw new Error(
      'Password must be at least 8 chars with 1 uppercase, 1 number, and 1 special character',
    )
  }
}

function handleSubmit() {
  errorMessage.value = ''

  try {
    validateForm()

    if (isLoginMode.value) {
      authStore.login({ email: form.email, password: form.password })
    } else {
      authStore.register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      })
    }

    const redirect = route.query.redirect || '/products'
    router.push(String(redirect))
  } catch (error) {
    errorMessage.value = error.message
  }
}
</script>
