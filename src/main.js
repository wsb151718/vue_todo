import { createApp } from 'vue'
import TodoPage from './components/page/TodoPage.vue'
import globalVariables from './plugins/globalVariables'
import validate from './plugins/validate'

const app = createApp(TodoPage)
app.use(globalVariables)
app.use(validate)

app.mount('#app')
