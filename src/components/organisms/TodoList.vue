<script setup>
import { inject } from 'vue'
import TodoItem from '../molecules/TodoItem.vue'
import { todoListInjectKey } from '@/keys/keys'

const { todoList, deleteTodo, editTodoText, toggleStatus } = inject(todoListInjectKey)
</script>

<template>
  <ul class="p-todoList">
    <TodoItem
      v-for="item in todoList"
      :key="item.id"
      v-bind="item"
      @toggle-state="toggleStatus(item)"
      @delete-item="deleteTodo(item)"
      @edit-item="(text) => editTodoText(item, text)"
    ></TodoItem>
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
