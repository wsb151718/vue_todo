import TodoList from '@/components/organisms/TodoList.vue'
import { setupTodoList } from '@/composables/useTodoList'
import validate from '@/plugins/validate'
import { cleanup, render, waitFor, screen } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { userEvent, page } from 'vitest/browser'
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
        { id: 3, text: 'third', finished: false },
        { id: 4, text: 'fourth', finished: false },
        { id: 5, text: 'fifth', finished: false },
        { id: 6, text: 'sixth', finished: false },
        { id: 7, text: 'seventh', finished: false },
        { id: 8, text: 'eightth', finished: false },
        { id: 9, text: 'nineth', finished: false },
        { id: 10, text: 'tenth', finished: false },
        { id: 11, text: 'eleventh', finished: false },
        { id: 12, text: 'twelveth', finished: false },
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

  test('編集テスト', async () => {
    renderTodoList()
    const user = userEvent.setup()

    await user.click(screen.getByText('first'))
    const input = screen.getByRole('textbox')
    await user.clear(input)
    await user.type(input, 'first changed{Enter}')

    expect(screen.getByText('first changed')).toBeInTheDocument()
  })

  test('コンテンツが最大表示数を超えているときのテスト', async () => {
    renderTodoList()
    const list = screen.getByTestId('todolist')
    expect(page.getByTestId('loading')).not.toBeInTheDocument()

    // scrollTop をセット
    list.scrollTop = list.scrollHeight - list.clientHeight

    // scroll イベント
    list.dispatchEvent(new Event('scroll', { bubbles: true }))

    await waitFor(() => {
      expect(page.getByTestId('loading')).toBeInTheDocument()
      expect(page.getByTestId('loading')).toBeVisible()
    })
    await waitFor(() => expect(screen.getByText('twelveth')).toBeInTheDocument(), { timeout: 3000 })
  })
})
