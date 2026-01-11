import TodoList from '@/components/organisms/TodoList.vue'
import { setupTodoList } from '@/composables/useTodoList'
import validate from '@/plugins/validate'
import { cleanup, render, screen, waitFor } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent, h } from 'vue'

function renderTodoList() {
  const Wrapper = defineComponent({
    setup: () => {
      setupTodoList()

      return () => h(TodoList)
    },
  })
  render(Wrapper, {
    global: {
      plugins: [validate],
    },
  })
}

describe('TodoList', () => {
  beforeEach(() => {
    localStorage.setItem(
      'todoList',
      JSON.stringify([
        { id: 1, text: 'first', finished: false },
        { id: 2, text: 'second', finished: false },
      ]),
    )
    localStorage.setItem('lastInsertId', '2')

    vi.stubGlobal('confirm', () => true)
  })

  afterEach(() => {
    cleanup()
    localStorage.clear()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test('初期のリストレンダリングテスト', () => {
    renderTodoList()

    expect(screen.getByText('first')).toBeInTheDocument()
    expect(screen.getByText('second')).toBeInTheDocument()
  })

  test('削除イベントテスト', async () => {
    renderTodoList()

    const user = userEvent.setup()

    const [firstDeleteButton] = screen.getAllByRole('button', { name: 'delete' })
    await user.click(firstDeleteButton)

    await waitFor(() => {
      expect(screen.queryByText('first')).not.toBeInTheDocument()
    })
  })

  test('edit event updates item text', async () => {
    renderTodoList()
    const user = userEvent.setup()

    await user.click(screen.getByText('first'))
    const input = screen.getByRole('textbox')
    await user.clear(input)
    await user.type(input, 'first changed{Enter}')

    expect(screen.getByText('first changed')).toBeInTheDocument()
  })
})
