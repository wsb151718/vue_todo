<script setup>
import { computed, ref, watch } from 'vue'
import Todo from '../template/Todo.vue'
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
  <Todo
    :filter-data="filterData"
    :todo-list="filterTodoList"
    @add-todo="addTodo"
    @delete-todos="deleteTodoFinished"
    @filter-todo="changeFilter"
    @toggle-todo-state="changeFinished"
    @delete-todo="deleteTodo"
    @edit-todo="editTodoText"
  ></Todo>
</template>

<style scoped></style>
