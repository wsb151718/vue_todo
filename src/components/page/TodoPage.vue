<script setup>
import { computed, ref, watch } from 'vue'
import TodoTemplate from '../template/TodoTemplate.vue'
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

const todoData = ref({
  lastInsertId: 0,
  list: [],
  init() {
    let savedTodoList = []
    let savedLastInsertId = 0
    try {
      savedLastInsertId = JSON.parse(localStorage.getItem('lastInsertId'))
      savedTodoList = JSON.parse(localStorage.getItem('todoList'))
    } catch (error) {
      savedLastInsertId = 0
      savedTodoList = []
      alert('データの取得に失敗しました。')
      console.error(error)
    } finally {
      this.lastInsertId = savedLastInsertId
      this.list = savedTodoList
    }
  },
})
const filterTodoList = computed(() => {
  return todoData.value.list.filter((todo) => {
    return !filterData.value.isFilter || todo.finished === filterData.value.isFinished
  })
})
watch(
  () => todoData.value.list,
  (newTodo) => {
    try {
      localStorage.setItem('todoList', JSON.stringify(newTodo))
    } catch (error) {
      alert('データの保存に失敗しました。')
      console.error(error)
    }
  },
  { deep: true },
)
watch(
  () => todoData.value.lastInsertId,
  (newId) => {
    try {
      localStorage.setItem('lastInsertId', newId)
    } catch (error) {
      alert('データの保存に失敗しました。')
      console.error(error)
    }
  },
)
function addTodo(text) {
  todoData.value.lastInsertId++
  todoData.value.list.push({ id: todoData.value.lastInsertId, text, finished: false })
}
function deleteTodo(target) {
  if (confirm('本当に削除しますか?')) {
    todoData.value.list = todoData.value.list.filter((todo) => todo !== target)
  }
}
function editTodoText(target, text) {
  target.text = text
}
function deleteTodoFinished() {
  if (confirm('完了済みタスクを全て削除しますか?')) {
    todoData.value.list = todoData.value.list.filter((todo) => todo.finished === false)
  }
}
function changeFinished(target) {
  const idx = todoData.value.list.findIndex((todo) => todo.id === target.id)

  if (idx !== -1) {
    todoData.value.list[idx].finished = !todoData.value.list[idx].finished
  }
}

todoData.value.init()
</script>

<template>
  <TodoTemplate
    :filter-data="filterData"
    :todo-list="filterTodoList"
    @add-todo="addTodo"
    @delete-todos="deleteTodoFinished"
    @filter-todo="changeFilter"
    @toggle-todo-state="changeFinished"
    @delete-todo="deleteTodo"
    @edit-todo="editTodoText"
  ></TodoTemplate>
</template>

<style scoped></style>
