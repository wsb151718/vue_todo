<script setup>
import { computed, provide, readonly, ref, watch } from 'vue'
import TodoTemplate from '../template/TodoTemplate.vue'

const isFilter = ref(false)
const isFinished = ref(false)
const filterList = ref([
  { status: 'all', isFilter: false, isFinished: false },
  { status: 'unfinished', isFilter: true, isFinished: false },
  { status: 'finished', isFilter: true, isFinished: true },
])
function changeFilter(filter) {
  isFilter.value = filter.isFilter
  isFinished.value = filter.isFinished
}
provide('filterData', {
  isFilter: readonly(isFilter),
  isFinished: readonly(isFinished),
  filterList: readonly(filterList),
  changeFilter,
})

const lastInsertId = ref(0)
const todoList = ref([])
const filterTodoList = computed(() => {
  return todoList.value.filter((todo) => {
    return !isFilter.value || todo.finished === isFinished.value
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
  { deep: true },
)
watch(lastInsertId, (newId) => {
  try {
    localStorage.setItem('lastInsertId', newId)
  } catch (error) {
    alert('データの保存に失敗しました。')
    console.error(error)
  }
})
function initTodoList() {
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
    lastInsertId.value = savedLastInsertId
    todoList.value = savedTodoList
  }
}
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
function deleteTodos(status) {
  const msgList = {
    all: 'タスクを全て削除しますか?',
    finished: 'タスクを全て削除しますか?',
    unfinished: '未完了タスクを全て削除しますか?',
  }

  const msg = msgList[status] ?? ''
  if (msg && confirm(msg)) {
    todoList.value = todoList.value.filter((todo) => todo.finished === false)
  }
}
function toggleStatus(target) {
  const idx = todoList.value.findIndex((todo) => todo.id === target.id)

  if (idx !== -1) {
    todoList.value[idx].finished = !todoList.value[idx].finished
  }
}

provide('todoData', {
  todoList: filterTodoList,
  addTodo,
  deleteTodo,
  editTodoText,
  deleteTodos,
  toggleStatus,
})

initTodoList()
</script>

<template>
  <TodoTemplate></TodoTemplate>
</template>

<style scoped></style>
