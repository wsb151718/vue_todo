<script setup></script>

<template>
  <button>
    <slot></slot>
  </button>
</template>

<style scoped>
button {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--main);
  color: #fff;
  padding: 8px;
  font-size: 1.2rem;
  border-radius: 4px;

  &:hover {
    opacity: 0.75;
  }
}
</style>
