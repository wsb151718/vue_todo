import { computed, inject, provide } from 'vue'
import { useTodo } from './useTodo'
import { useTodoFilter } from './useTodoFilter'

const todoListInjectKey = Symbol()
export function setupTodoList() {
  const todo = useTodo()
  const filter = useTodoFilter()
  const filterTodoList = computed(() => {
    return todo.todoList.value.filter((item) => {
      return !filter.isFilter.value || item.finished === filter.isFinished.value
    })
  })

  provide(todoListInjectKey, {
    isFilter: filter.isFilter,
    isFinished: filter.isFinished,
    filterList: filter.filterList,
    changeFilter: filter.changeFilter,
    todoList: filterTodoList,
    addTodo: todo.addTodo,
    editTodoText: todo.editTodoText,
    deleteTodo: todo.deleteTodo,
    deleteTodos: todo.deleteTodos,
    toggleStatus: todo.toggleStatus,
  })
}

export function useTodoList() {
  const todo = inject(todoListInjectKey)

  if (!todo) {
    throw new Error('TodoList is not provided')
  }

  return todo
}
