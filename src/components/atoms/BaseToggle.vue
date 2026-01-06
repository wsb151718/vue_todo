<script setup>
const checkModel = defineModel({ type: Boolean, required: true })
</script>

<template>
  <div class="c-toggle">
    <input v-model="checkModel" type="checkbox" />
    <div class="c-toggle__handle"></div>
  </div>
</template>

<style scoped>
.c-toggle {
  width: 60px;
  --height: 23px;
  height: var(--height);
  border-radius: calc(infinity * 1px);
  background: #aaa;
  transition: background 0.25s ease;
  position: relative;
  z-index: 2;

  &:has(input[type='checkbox']:checked) {
    background: var(--alert);
  }
}

.c-toggle__handle {
  --handleW: calc(var(--height) + 2px);
  width: calc(var(--height) + 2px);
  height: calc(var(--height) + 2px);
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 0 5px #aaa;
  border: 1px solid #aaa;
  transition: left 0.25s ease;
}
input[type='checkbox'] {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
}
input[type='checkbox']:checked + .c-toggle__handle {
  left: calc(100% - var(--handleW));
}
</style>
