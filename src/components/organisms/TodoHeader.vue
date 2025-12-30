<script setup>
import { ref } from 'vue'
import TrashIcon from '../icon/TrashIcon.vue'
import TodoForm from '../molecules/TodoForm.vue'

const props = defineProps(['showCount', 'buttons', 'isFilter', 'isFinished'])
const emits = defineEmits(['addTodo', 'deleteTodos', 'filterTodo'])
</script>

<template>
  <div class="c-heading">
    <h1 class="c-heading__title">Vue Todo</h1>
    <p>表示件数 {{ showCount }}件</p>
  </div>
  <TodoForm @add="(text) => $emit('addTodo', text)"></TodoForm>
  <div class="p-itemWrapper">
    <ul class="c-buttonList">
      <li v-for="button in buttons" :key="button.text">
        <button
          class="c-capsuelButton"
          :class="{
            active: isFilter === button.isFilter && isFinished === button.isFinished,
          }"
          @click="$emit('filterTodo', button)"
        >
          {{ button.text }}
        </button>
      </li>
    </ul>
    <button class="c-capsuelButton alert active" @click="$emit('deleteTodos')">
      <TrashIcon class="icon" />削除
    </button>
  </div>
</template>

<style scoped>
.p-itemWrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.c-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 12px;
}
.c-heading__title {
  font-size: 2.2rem;
  font-weight: bold;
}
.c-buttonList {
  display: flex;
  align-items: center;
  gap: 10px;
}
.c-capsuelButton {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 3px 8px;
  --color: #aaa;
  color: var(--color);
  border: 1px solid var(--color);
  font-size: 1.2rem;
  border-radius: calc(infinity * 1px);
  white-space: nowrap;

  &.active {
    --color: var(--main);
    color: #fff;
    background-color: var(--color);
  }
  &.alert {
    --color: var(--alert);
  }

  & > .icon {
    width: 15px;
    height: 15px;
  }

  &:hover,
  &:focus {
    opacity: 0.7;
  }
}
</style>
