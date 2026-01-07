import { computed } from 'vue'
import { useTodo } from './useTodo'
import { useTodoFilter } from './useTodoFilter'

export function useTodoList() {
  const todo = useTodo()
  const filter = useTodoFilter()
  const filterTodoList = computed(() => {
    return todo.todoList.value.filter((item) => {
      return !filter.isFilter.value || item.finished === filter.isFinished.value
    })
  })

  return {
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
  }
}
