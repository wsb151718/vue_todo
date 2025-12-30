<script setup>
import TodoItem from './TodoItem.vue'

const props = defineProps(['list'])
const emits = defineEmits(['toggleFinished', 'deleteItem', 'editItem'])
</script>

<template>
  <ul class="p-todoList">
    <TodoItem
      v-for="item in list"
      :key="item.id"
      :text="item.text"
      :id="item.id"
      :finished="item.finished"
      @change-finished="$emit('toggleFinished', item)"
      @delete-item="$emit('deleteItem', item)"
      @edit-item="(text) => $emit('editItem', item, text)"
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
