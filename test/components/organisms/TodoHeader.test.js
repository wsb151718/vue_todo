import TodoHeader from '@/components/organisms/TodoHeader.vue'
import { setupTodoList } from '@/composables/useTodoList'
import globalVariables from '@/plugins/globalVariables'
import validate from '@/plugins/validate'
import { cleanup, render, screen, waitFor } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent, h, nextTick } from 'vue'

function renderTodoHeader() {
  const Wrapper = defineComponent({
    setup() {
      setupTodoList()
      return () => h(TodoHeader)
    },
  })

  return render(Wrapper, {
    global: {
      plugins: [globalVariables, validate],
    },
  })
}

describe('TodoHeader', () => {
  beforeEach(() => {
    localStorage.setItem(
      'todoList',
      JSON.stringify([
        { id: 1, text: 'one', finished: false },
        { id: 2, text: 'two', finished: true },
        { id: 3, text: 'three', finished: true },
      ]),
    )
    localStorage.setItem('lastInsertId', '2')
  })

  afterEach(() => {
    cleanup()
    localStorage.clear()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  test('初期表示時のテスト', () => {
    renderTodoHeader()

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Vue Todo')

    const filterButtons = screen.getAllByRole('button', { name: /^filter-task-.*$/ })
    expect(filterButtons).toHaveLength(3)
    const addButtons = screen.getAllByRole('button', { name: 'add-task' })
    expect(addButtons).toHaveLength(1)
    const deleteButtons = screen.getAllByRole('button', { name: 'all-delete' })
    expect(deleteButtons).toHaveLength(1)
    expect(filterButtons[0]).toHaveClass('active')
  })

  test('フィルターボタンを押したときの挙動', async () => {
    renderTodoHeader()
    const user = userEvent.setup()
    const buttons = screen.getAllByRole('button')

    await user.click(buttons[1])
    await nextTick()
    expect(buttons[1]).toHaveClass('active')
    expect(buttons[0]).not.toHaveClass('active')

    await user.click(buttons[2])
    await nextTick()
    expect(buttons[2]).toHaveClass('active')
    expect(buttons[1]).not.toHaveClass('active')
  })

  test('一括削除ボタンを押したときに完了済みタスクのみ削除されているか', async () => {
    renderTodoHeader()
    const user = userEvent.setup()
    const buttons = screen.getAllByRole('button')
    const deleteButton = buttons.at(-1)

    const confirmSpy = vi.fn()
    vi.stubGlobal('confirm', confirmSpy)
    confirmSpy.mockReturnValueOnce(false)
    await user.click(deleteButton)
    expect(confirmSpy).toHaveBeenCalledTimes(1)
    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('todoList'))
      expect(stored).toHaveLength(3)
    })

    confirmSpy.mockReturnValueOnce(true)
    await user.click(deleteButton)
    expect(confirmSpy).toHaveBeenCalledTimes(2)
    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('todoList'))
      expect(stored).toHaveLength(1)
      expect(stored[0].finished).toBe(false)
    })
  })
})
