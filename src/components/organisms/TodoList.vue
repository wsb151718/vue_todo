<script setup>
import { inject } from 'vue'
import TodoItem from '../molecules/TodoItem.vue'
import { todoListInjectKey } from '@/keys/keys'

const { todoList, deleteTodo, editTodoText, toggleStatus } = inject(todoListInjectKey)
</script>

<template>
  <TransitionGroup tag="ul" class="p-todoList">
    <TodoItem
      v-for="item in todoList"
      :key="item.id"
      v-bind="item"
      @toggle-state="toggleStatus(item)"
      @delete-item="deleteTodo(item)"
      @edit-item="(text) => editTodoText(item, text)"
    ></TodoItem>
  </TransitionGroup>
  <ul class="p-todoList"></ul>
</template>

<style scoped>
.p-todoList {
  display: flex;
  flex-flow: column nowrap;
  gap: 10px;
  margin-top: 20px;
  position: relative;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.v-leave-to {
  transform: translateX(30px) scaleY(0.01);
}

.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}

.v-leave-active {
  position: absolute;
}
</style>
