<script setup>
import { useTodoList } from '@/composables/useTodoList'
import TodoTemplate from '../template/TodoTemplate.vue'
import { provide } from 'vue'
import { todoListInjectKey } from '@/keys/keys'

provide(todoListInjectKey, useTodoList())
</script>

<template>
  <TodoTemplate></TodoTemplate>
</template>

<style scoped></style>
