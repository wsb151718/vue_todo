<script setup>
defineProps({
  isAlert: Boolean,
})
</script>

<template>
  <button :class="{ alert: isAlert }">
    <slot></slot>
  </button>
</template>

<style scoped>
button {
  --bgColor: var(--main);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bgColor);
  color: #fff;
  padding: 8px;
  font-size: 1.2rem;
  border-radius: 4px;

  &.alert {
    --bgColor: var(--alert);
  }

  &:hover {
    opacity: 0.75;
  }
}
</style>
