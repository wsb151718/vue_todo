<script setup>
import TodoItem from '../molecules/TodoItem.vue'
import { useTodoList } from '@/composables/useTodoList'
import { computed, ref } from 'vue'
import LoadingIcon from '../icon/LoadingIcon.vue'

const { todoList, deleteTodo, editTodoText, toggleStatus } = useTodoList()

const page = ref(1)
const perPage = 10
const max = Math.ceil(todoList.value.length / perPage)
const showingTodoList = computed(() => {
  return todoList.value.slice(0, page.value * perPage)
})

const isLoading = ref(false)
function addShowing(e) {
  const currentBottom = Math.ceil(e.target.scrollTop + e.target.clientHeight)
  const isScrolled = currentBottom >= e.target.scrollHeight
  console.log(currentBottom, e.target.scrollHeight)

  if (page.value < max && isScrolled && !isLoading.value) {
    isLoading.value = true
    // 遅延させる。
    setTimeout(() => {
      page.value = page.value + 1
      isLoading.value = false
    }, 2000)
  }
}
</script>

<template>
  <TransitionGroup tag="ul" class="p-todoList" data-testid="todolist" @scroll="addShowing">
    <TodoItem
      v-for="item in showingTodoList"
      :key="item.id"
      v-bind="item"
      @toggle-state="toggleStatus(item)"
      @delete-item="deleteTodo(item)"
      @edit-item="(text) => editTodoText(item, text)"
    ></TodoItem>
    <li v-if="isLoading" key="loading-icon" class="c-loading" data-testid="loading">
      <LoadingIcon></LoadingIcon>
    </li>
  </TransitionGroup>
</template>

<style scoped>
.p-todoList {
  display: flex;
  flex-flow: column nowrap;
  gap: 10px;
  margin-top: 20px;
  position: relative;
  max-height: 350.4px;
  overflow-y: auto;
}

.c-loading {
  width: 100%;
  text-align: center;

  & svg {
    animation: rotate 2s infinite linear;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  50% {
    transform: rotate(180deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.v-enter-from:not(.c-loading),
.v-leave-to:not(.c-loading) {
  transform: translateY(30px);
}

.v-leave-to.c-loading {
  transform: scale(0.01);
}

.v-move,
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease-in-out;
}

.v-leave-active:not(.c-loading) {
  position: absolute;
}
</style>
