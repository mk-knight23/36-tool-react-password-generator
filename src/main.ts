import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())

app.config.errorHandler = (err, instance, info) => {
    console.error('Global Error Handling:', err, instance, info);
    // Optional: Record error to stats store if needed
}

app.mount('#app')
