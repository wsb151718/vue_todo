<script setup>
import { computed, ref, watch } from 'vue'
import TrashIcon from './components/icon/TrashIcon.vue'
import TodoForm from './components/TodoForm.vue'
import TodoList from './components/TodoList.vue'

const filterData = ref({
  isFilter: false,
  isFinished: null,
  buttons: [
    { text: '全て', isFilter: false, isFinished: null },
    { text: '未完了', isFilter: true, isFinished: false },
    { text: '完了', isFilter: true, isFinished: true },
  ],
})
function changeFilter(button) {
  filterData.value.isFilter = button.isFilter
  filterData.value.isFinished = button.isFinished
}

let savedTodoList = []
let savedLastInsertId = 0

try {
  savedTodoList = JSON.parse(localStorage.getItem('todoList'))
  savedLastInsertId = JSON.parse(localStorage.getItem('lastInsertId'))
} catch (error) {
  savedTodoList = []
  savedLastInsertId = 0
  alert('データの取得に失敗しました。')
  console.error(error)
}

const todoList = ref(savedTodoList || [])
const lastInsertId = ref(savedLastInsertId)
const filterTodoList = computed(() => {
  return todoList.value.filter((todo) => {
    return !filterData.value.isFilter || todo.finished === filterData.value.isFinished
  })
})
watch(
  todoList,
  (newTodo) => {
    try {
      localStorage.setItem('todoList', JSON.stringify(newTodo))
    } catch (error) {
      alert('データの保存に失敗しました。')
      console.error(error)
    }
  },
  { deep: true }
)
watch(lastInsertId, (newId) => {
  try {
    localStorage.setItem('lastInsertId', newId)
  } catch (error) {
    alert('データの保存に失敗しました。')
    console.error(error)
  }
})
function addTodo(text) {
  lastInsertId.value++
  todoList.value.push({ id: lastInsertId.value, text, finished: false })
}
function deleteTodo(target) {
  if (confirm('本当に削除しますか?')) {
    todoList.value = todoList.value.filter((todo) => todo !== target)
  }
}
function editTodoText(target, text) {
  target.text = text
}
function deleteTodoFinished() {
  if (confirm('完了済みタスクを全て削除しますか?')) {
    todoList.value = todoList.value.filter((todo) => todo.finished === false)
  }
}
function changeFinished(target) {
  const idx = todoList.value.findIndex((todo) => todo.id === target.id)

  if (idx !== -1) {
    todoList.value[idx].finished = !todoList.value[idx].finished
  }
}
</script>

<template>
  <div class="c-todoBox">
    <div class="c-heading">
      <h1 class="c-heading__title">Vue Todo</h1>
      <p>表示件数 {{ filterTodoList.length }}件</p>
    </div>
    <TodoForm @add="addTodo"></TodoForm>
    <div class="p-itemWrapper">
      <ul class="c-buttonList">
        <li v-for="button in filterData.buttons" :key="button.text">
          <button
            class="c-capsuelButton"
            :class="{
              active:
                filterData.isFilter === button.isFilter &&
                filterData.isFinished === button.isFinished,
            }"
            @click="changeFilter(button)"
          >
            {{ button.text }}
          </button>
        </li>
      </ul>
      <button class="c-capsuelButton alert active" @click="deleteTodoFinished">
        <TrashIcon class="icon" />削除
      </button>
    </div>
    <TodoList
      :list="filterTodoList"
      @toggle-finished="changeFinished"
      @delete-item="deleteTodo"
      @edit-item="editTodoText"
    ></TodoList>
  </div>
</template>

<style scoped>
.p-itemWrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.c-todoBox {
  background-color: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0px 5px 10px #aaa;
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translate(-50%);
  width: 500px;
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
