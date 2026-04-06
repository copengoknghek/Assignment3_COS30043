import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// Custom directive: v-focus - auto-focuses input element on mount
app.directive('focus', {
  mounted(el) {
    el.focus()
  },
})

app.use(createPinia())
app.use(router)

app.mount('#app')
