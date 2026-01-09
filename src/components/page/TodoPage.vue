<script setup>
import { setupTodoList } from '@/composables/useTodoList'
import TodoTemplate from '../template/TodoTemplate.vue'

setupTodoList()
</script>

<template>
  <TodoTemplate></TodoTemplate>
</template>

<style scoped></style>
