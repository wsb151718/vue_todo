<script setup>
import { ref, watch } from 'vue'
import ToggleItem from './BaseToggle.vue'
import BaseCircleButton from './BaseCircleButton.vue'

const props = defineProps(['text', 'id', 'finished'])
const emits = defineEmits(['changeFinished', 'deleteItem'])

const toggleModel = ref(props.finished)
watch(toggleModel, () => {
  emits('changeFinished')
})
</script>

<template>
  <li class="c-todoItem" :class="{ disabled: finished }">
    <div class="c-todoItem__main">
      <p class="c-todoItem__text">{{ text }}</p>
      <input type="text" class="c-todoItem__input" />
    </div>
    <div class="c-todoItem__parts">
      <ToggleItem v-model="toggleModel" />
      <BaseCircleButton :is-delete="true" @click-handler="$emit('deleteItem')"></BaseCircleButton>
    </div>
  </li>
</template>

<style scoped>
.c-todoItem {
  font-size: 1.4rem;
  border-radius: 8px;
  border: 1px solid currentColor;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.25s ease;
  &.disabled {
    color: #aaa;
    & .c-todoItem__text {
      text-decoration: line-through;
    }
  }
}
.c-todoItem__input {
  display: none;
}

.c-todoItem__parts {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}
</style>
