<script setup>
import TodoItem from '../molecules/TodoItem.vue'

defineProps(['list'])
defineEmits(['toggleItemState', 'deleteItem', 'editItem'])
</script>

<template>
  <ul class="p-todoList">
    <TodoItem
      v-for="item in list"
      :id="item.id"
      :key="item.id"
      :text="item.text"
      :finished="item.finished"
      @toggle-state="$emit('toggleItemState', item)"
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
