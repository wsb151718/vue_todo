<script setup></script>

<template>
  <p class="error" role="alert">
    <slot></slot>
  </p>
</template>

<style scoped>
.error {
  color: var(--alert);
  font-size: 1.2rem;
}
</style>
