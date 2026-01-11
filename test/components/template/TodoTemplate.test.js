import TodoTemplate from '@/components/template/TodoTemplate.vue'
import { setupTodoList } from '@/composables/useTodoList'
import globalVariables from '@/plugins/globalVariables'
import validate from '@/plugins/validate'
import { cleanup, render, screen, waitFor } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent, h } from 'vue'

const originalConfirm = window.confirm

function renderTemplate() {
  const Wrapper = defineComponent({
    setup() {
      setupTodoList()
      return () => h(TodoTemplate)
    },
  })

  return render(Wrapper, {
    global: {
      plugins: [globalVariables, validate],
    },
  })
}

function seedTodos(todos) {
  localStorage.setItem('todoList', JSON.stringify(todos))
  const lastId = todos.length ? Math.max(...todos.map((todo) => todo.id)) : 0
  localStorage.setItem('lastInsertId', String(lastId))
}

describe('TodoTemplate', () => {
  beforeEach(() => {
    vi.stubGlobal('confirm', vi.fn().mockRejectedValue(true))
  })

  afterEach(() => {
    cleanup()
    localStorage.clear()
    Object.defineProperty(window, 'confirm', {
      value: originalConfirm,
      configurable: true,
    })
    vi.restoreAllMocks()
  })

  test('adds a new todo via the form', async () => {
    seedTodos([])
    renderTemplate()
    const user = userEvent.setup()

    const input = screen.getByRole('textbox', { name: 'input-task' })
    await user.type(input, 'new task')
    await user.click(screen.getByRole('button', { name: 'add-task' }))

    expect(screen.getByText('new task')).toBeInTheDocument()
  })

  test('filters to show only finished items', async () => {
    seedTodos([
      { id: 1, text: 'unfinished', finished: false },
      { id: 2, text: 'finished', finished: true },
    ])
    renderTemplate()
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: 'filter-task-finished' }))

    await waitFor(() => {
      expect(screen.queryByText('unfinished')).not.toBeInTheDocument()
      expect(screen.getByText('finished')).toBeInTheDocument()
    })
  })

  test('deletes finished items from the list', async () => {
    seedTodos([
      { id: 1, text: 'keep', finished: false },
      { id: 2, text: 'remove', finished: true },
    ])
    renderTemplate()
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: 'all-delete' }))

    await waitFor(() => {
      expect(screen.queryByText('remove')).not.toBeInTheDocument()
      expect(screen.getByText('keep')).toBeInTheDocument()
    })
  })
})
