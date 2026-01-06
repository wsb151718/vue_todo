<script setup>
import TodoList from '../organisms/TodoList.vue'
import TodoHeader from '../organisms/TodoHeader.vue'

defineProps({
  filterData: {
    type: Object,
    required: true,
  },
  todoList: {
    type: Array,
    required: true,
  },
})
defineEmits(['addTodo', 'deleteTodos', 'filterTodo', 'toggleTodoState', 'deleteTodo', 'editTodo'])
</script>

<template>
  <div class="c-todoBox">
    <TodoHeader
      :show-count="todoList.length"
      :is-filter="filterData.isFilter"
      :is-finished="filterData.isFinished"
      :buttons="filterData.buttons"
      @add-todo="(text) => $emit('addTodo', text)"
      @delete-todos="$emit('deleteTodos')"
      @filter-todo="(button) => $emit('filterTodo', button)"
    ></TodoHeader>
    <TodoList
      :list="todoList"
      @toggle-item-state="(todo) => $emit('toggleTodoState', todo)"
      @delete-item="(todo) => $emit('deleteTodo', todo)"
      @edit-item="(todo, text) => $emit('editTodo', todo, text)"
    ></TodoList>
  </div>
</template>

<style scoped>
.c-todoBox {
  background-color: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0px 5px 10px #aaa;
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translate(-50%);
  width: 500px;
}
</style>
