<script setup>
const props = defineProps(['placeholder'])
</script>

<template>
  <input type="text" class="c-input" :placeholder="placeholder" />
</template>

<style scoped>
.c-input {
  background-color: #eff3f5;
  border-radius: 8px;
  border: 1px solid #aaa;
  font-size: 1.4rem;
  padding: 6px;

  &:placeholder-shown {
    color: #aaa;
  }
}
</style>
