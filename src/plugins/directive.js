export default {
  install(app) {
    app.directive('click-outside', {
      mounted: (el, binding) => {
        el.clickOutsideActive = false
        el.clickHandler = (e) => {
          if (!el.clickOutsideActive) {
            return
          }
          if (el !== e.target && !el.contains(e.target)) {
            binding.value()
          }
        }
        document.addEventListener('click', el.clickHandler)
        el.clickOutsideTimer = setTimeout(() => {
          el.clickOutsideActive = true
        }, 0)
      },
      unmounted: (el) => {
        document.removeEventListener('click', el.clickHandler)
        if (el.clickOutsideTimer) {
          clearTimeout(el.clickOutsideTimer)
        }
      },
    })
  },
}
