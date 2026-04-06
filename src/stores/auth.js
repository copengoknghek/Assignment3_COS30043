import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const USERS_KEY = 'mini-shop-users'
const CURRENT_USER_KEY = 'mini-shop-current-user'
const ADMIN_EMAIL = 'admin@chan.com'

function getStorageArray(key) {
  const raw = localStorage.getItem(key)
  return raw ? JSON.parse(raw) : []
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validatePassword(password) {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
  return passwordRegex.test(password)
}

export const useAuthStore = defineStore('auth', () => {
  const users = ref(getStorageArray(USERS_KEY))
  const currentUser = ref(JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null'))

  const isAuthenticated = computed(() => !!currentUser.value)
  const isAdmin = computed(() => currentUser.value?.email === ADMIN_EMAIL)
  const lastRegisteredUser = computed(() => {
    if (!users.value.length) return null
    return users.value[users.value.length - 1]
  })

  function persistUsers() {
    localStorage.setItem(USERS_KEY, JSON.stringify(users.value))
  }

  function register({ firstName, lastName, email, password }) {
    const normalizedFirstName = firstName.trim()
    const normalizedLastName = lastName.trim()
    const normalizedEmail = email.trim().toLowerCase()

    if (normalizedFirstName.length < 2 || normalizedFirstName.length > 30) {
      throw new Error('First name must be between 2 and 30 characters')
    }

    if (normalizedLastName.length < 2 || normalizedLastName.length > 30) {
      throw new Error('Last name must be between 2 and 30 characters')
    }

    if (!validateEmail(normalizedEmail)) {
      throw new Error('Please enter a valid email')
    }

    if (!validatePassword(password)) {
      throw new Error(
        'Password must be at least 8 chars with 1 uppercase, 1 number, and 1 special character',
      )
    }

    const existed = users.value.find((user) => user.email === normalizedEmail)

    if (existed) {
      throw new Error('Email already exists')
    }

    const newUser = {
      id: Date.now(),
      firstName: normalizedFirstName,
      lastName: normalizedLastName,
      name: `${normalizedFirstName} ${normalizedLastName}`.trim(),
      email: normalizedEmail,
      password,
    }

    users.value.push(newUser)
    persistUsers()
    login({ email: normalizedEmail, password })
  }

  function login({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase()

    if (!validateEmail(normalizedEmail)) {
      throw new Error('Please enter a valid email')
    }

    if (!password) {
      throw new Error('Password is required')
    }

    const found = users.value.find(
      (user) => user.email === normalizedEmail && user.password === password,
    )

    if (!found) {
      throw new Error('Invalid email or password')
    }

    currentUser.value = {
      id: found.id,
      firstName: found.firstName || found.name?.split(' ')?.[0] || '',
      lastName: found.lastName || found.name?.split(' ')?.slice(1).join(' ') || '',
      name: found.name,
      email: found.email,
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser.value))
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem(CURRENT_USER_KEY)
  }

  return {
    users,
    currentUser,
    isAuthenticated,
    isAdmin,
    lastRegisteredUser,
    register,
    login,
    logout,
  }
})
