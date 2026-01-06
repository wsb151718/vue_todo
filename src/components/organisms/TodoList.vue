<script setup>
import TodoItem from '../molecules/TodoItem.vue'

defineProps({
  list: {
    type: Array,
    required: true,
  },
})
defineEmits(['toggleItemState', 'deleteItem', 'editItem'])
</script>

<template>
  <ul class="p-todoList">
    <TodoItem
      v-for="item in list"
      :key="item.id"
      v-bind="item"
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
