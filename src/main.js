import { createApp } from 'vue'
import App from './App.vue'
import route from './route'
import ElementPlus from 'element-plus'

const app = createApp(App)
app.use(ElementPlus)
app.use(route)
app.mount('#app')
