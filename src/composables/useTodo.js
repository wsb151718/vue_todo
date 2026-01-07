import { useLocalStorage } from './useLocalStorage'

export function useTodo() {
  const lastInsertId = useLocalStorage('lastInsertId', 0)
  const todoList = useLocalStorage('todoList', [])

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
  function toggleStatus(target) {
    const idx = todoList.value.findIndex((todo) => todo.id === target.id)

    if (idx !== -1) {
      todoList.value[idx].finished = !todoList.value[idx].finished
    }
  }
  function deleteTodos(status) {
    const statusList = {
      all: {
        msg: 'タスクを全て削除しますか?',
        finished: null,
      },
      finished: {
        msg: '完了済タスクを全て削除しますか?',
        finished: true,
      },
      unfinished: {
        msg: '未完了タスクを全て削除しますか?',
        finished: false,
      },
    }
    const msg = statusList[status]['msg'] ?? ''
    if (msg && confirm(msg)) {
      todoList.value = todoList.value.filter((todo) => {
        if (status === 'all') {
          return false
        }
        return todo.finished !== statusList[status].finished
      })
    }
  }

  return { lastInsertId, todoList, addTodo, deleteTodo, editTodoText, deleteTodos, toggleStatus }
}
