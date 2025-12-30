<script setup>
import TodoItem from '../molecules/TodoItem.vue'

const props = defineProps(['list'])
const emits = defineEmits(['toggleItemState', 'deleteItem', 'editItem'])
</script>

<template>
  <ul class="p-todoList">
    <TodoItem
      v-for="item in list"
      :key="item.id"
      :text="item.text"
      :id="item.id"
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
