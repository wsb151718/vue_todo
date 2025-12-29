<script setup>
import TodoItem from './TodoItem.vue'

const props = defineProps(['list'])
const emits = defineEmits(['toggle-finished'])
</script>

<template>
  <ul class="p-todoList">
    <TodoItem
      v-for="item in list"
      :key="item.id"
      :text="item.text"
      :id="item.id"
      :finished="item.finished"
      @change-finished="$emit('toggle-finished', item)"
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
