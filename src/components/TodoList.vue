<script setup>
import TodoItem from './TodoItem.vue'
</script>

<template>
  <ul class="p-todoList">
    <TodoItem text="テスト"></TodoItem>
  </ul>
</template>

<style scoped>
.p-todoList {
  display: flex;
  flex-flow: column nowrap;
  gap: 10px;
  margin-top: 20px;
}
</style>
