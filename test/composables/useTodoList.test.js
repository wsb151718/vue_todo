import { createApp, defineComponent, h, ref } from 'vue'
import { describe, expect, test, vi } from 'vitest'

vi.mock('@/composables/useTodo', () => {
  return {
    useTodo: () => {
      const lastInsertId = ref(5)
      const todoList = ref([
        { id: 1, text: 'stringA', finished: false },
        { id: 2, text: 'stringB', finished: true },
        { id: 3, text: 'stringC', finished: true },
        { id: 4, text: 'stringD', finished: false },
        { id: 5, text: 'stringE', finished: true },
      ])
      const addTodo = vi.fn()
      const editTodoText = vi.fn()
      const deleteTodo = vi.fn()
      const toggleStatus = vi.fn()
      const deleteTodos = vi.fn()

      return {
        lastInsertId,
        todoList,
        addTodo,
        editTodoText,
        deleteTodo,
        toggleStatus,
        deleteTodos,
      }
    },
  }
})
vi.mock('@/composables/useTodoFilter', () => {
  return {
    useTodoFilter: () => {
      const isFilter = ref(false)
      const isFinished = ref(false)
      const filterList = ref([
        { status: 'all', isFilter: false, isFinished: false },
        { status: 'unfinished', isFilter: true, isFinished: false },
        { status: 'finished', isFilter: true, isFinished: true },
      ])
      const changeFilter = vi.fn()

      return { isFilter, isFinished, filterList, changeFilter }
    },
  }
})

import { setupTodoList, useTodoList } from '@/composables/useTodoList'

function getTodoList() {
  let composable

  const Child = defineComponent({
    setup: () => {
      composable = useTodoList()
      return () => null
    },
  })

  const app = createApp({
    setup: () => {
      setupTodoList()
      return () => h(Child)
    },
  })

  app.mount(document.createElement('div'))

  return composable
}
describe('filterTodoList test', () => {
  test('全てのタスクを取得する場合', () => {
    const { todoList, isFilter, isFinished } = getTodoList()
    isFilter.value = false
    isFinished.value = false
    expect(todoList.value).toEqual([
      { id: 1, text: 'stringA', finished: false },
      { id: 2, text: 'stringB', finished: true },
      { id: 3, text: 'stringC', finished: true },
      { id: 4, text: 'stringD', finished: false },
      { id: 5, text: 'stringE', finished: true },
    ])
  })
  test('未完了タスクのみを取得する場合', () => {
    const { todoList, isFilter, isFinished } = getTodoList()
    isFilter.value = true
    isFinished.value = false
    expect(todoList.value).toEqual([
      { id: 1, text: 'stringA', finished: false },
      { id: 4, text: 'stringD', finished: false },
    ])
  })
  test('未完了タスクのみを取得する場合', () => {
    const { todoList, isFilter, isFinished } = getTodoList()
    isFilter.value = true
    isFinished.value = true
    expect(todoList.value).toEqual([
      { id: 2, text: 'stringB', finished: true },
      { id: 3, text: 'stringC', finished: true },
      { id: 5, text: 'stringE', finished: true },
    ])
  })
  test('フィルターなしで条件を指定している場合は、全権取得する', () => {
    const { todoList, isFilter, isFinished } = getTodoList()
    isFilter.value = false
    isFinished.value = true
    expect(todoList.value).toEqual([
      { id: 1, text: 'stringA', finished: false },
      { id: 2, text: 'stringB', finished: true },
      { id: 3, text: 'stringC', finished: true },
      { id: 4, text: 'stringD', finished: false },
      { id: 5, text: 'stringE', finished: true },
    ])
  })
})
