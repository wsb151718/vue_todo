<script setup>
defineEmits('clickHandler')
defineProps({
  isDelete: Boolean,
})
</script>

<template>
  <button
    class="c-circleButton"
    :class="{ 'c-circleButton--delete': isDelete }"
    @click="$emit('clickHandler')"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
.c-circleButton {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--main);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  position: relative;

  &.c-circleButton--delete {
    background-color: var(--alert);
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 40%;
      height: 2px;
      background-color: #fff;
    }
  }

  &:hover {
    opacity: 0.7;
  }
}
</style>
