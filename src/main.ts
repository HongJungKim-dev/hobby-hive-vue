import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin, QueryClient, VueQueryPluginOptions } from '@tanstack/vue-query'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import './assets/main.css'
import '@/styles/globals.scss'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10, // 10 seconds
      cacheTime: 1000 * 20, // 20 seconds
    },
  },
})

// Options for VueQueryPlugin (if any devtools or plugins needed)
const vueQueryOptions: VueQueryPluginOptions = {
  queryClient,
}

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin, vueQueryOptions) // Add VueQueryPlugin to the app
app.use(Antd)
app.use(ElementPlus)
app.mount('#app')
