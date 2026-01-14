<script setup>
defineOptions({
  inheritAttrs: false,
})

const isOpen = defineModel({
  type: Boolean,
})

function close() {
  isOpen.value = false
}
</script>

<template>
  <div class="c-modal js-modal">
    <div v-click-outside="close" class="c-modal__container" v-bind="$attrs">
      <a class="c-modal__close" href="javascript:void(0)" @click="close">×</a>
      <div class="c-modal__main">
        <slot name="header"></slot>
        <slot></slot>
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-modal {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  z-index: 5000;
  background: rgba(0, 0, 0, 0.5);
}
.c-modal__container {
  width: 600px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 80vh;
  background-color: #fff;
  border-radius: 16px;
  padding: 30px;
  z-index: 1000;
}
.c-modal__close {
  display: block;
  font-size: 4rem;
  line-height: 1;
  text-align: right;
  margin-bottom: 20px;
}
.c-modal__main {
  padding-inline: 20px;
}
</style>
