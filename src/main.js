import { createApp } from 'vue'
import TodoPage from './components/page/TodoPage.vue'
import globalVariables from './plugins/globalVariables'
import validate from './plugins/validate'
import directive from './plugins/directive'

const app = createApp(TodoPage)
app.use(globalVariables)
app.use(validate)
app.use(directive)

app.mount('#app')
