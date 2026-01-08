export default {
  install(app) {
    app.config.globalProperties.$env = {
      app_name: 'Vue Todo',
    }
  },
}
