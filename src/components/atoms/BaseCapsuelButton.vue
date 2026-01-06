<script setup>
import { computed } from 'vue'

const props = defineProps({
  isActive: Boolean,
  isAlert: Boolean,
})
defineEmits(['clickHandler'])

const classObj = computed(() => ({
  active: props.isActive,
  alert: props.isAlert,
}))
</script>

<template>
  <button class="c-capsuelButton" :class="classObj" @click="$emit('clickHandler')">
    <slot></slot>
  </button>
</template>

<style scoped>
.c-capsuelButton {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 3px 8px;
  --color: #aaa;
  color: var(--color);
  border: 1px solid var(--color);
  font-size: 1.2rem;
  border-radius: calc(infinity * 1px);
  white-space: nowrap;

  &.active {
    --color: var(--main);
    color: #fff;
    background-color: var(--color);
  }
  &.alert {
    --color: var(--alert);
  }

  & > .icon {
    width: 15px;
    height: 15px;
  }

  &:hover,
  &:focus {
    opacity: 0.7;
  }
}
</style>
