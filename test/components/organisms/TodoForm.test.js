import TodoForm from '@/components/organisms/TodoForm.vue'
import validate from '@/plugins/validate'
import { cleanup, render, screen, waitFor } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

const { addTodoSpy } = vi.hoisted(() => {
  return {
    addTodoSpy: vi.fn(),
  }
})

vi.mock('@/composables/useTodoList', () => {
  return {
    useTodoList: () => ({
      addTodo: addTodoSpy,
    }),
    // もしテスト内で setupTodoList を呼んでるなら、それもダミーで生やす
    setupTodoList: vi.fn(),
  }
})
describe('user interactive test', () => {
  beforeEach(() => {
    localStorage.clear()
    render(TodoForm, { global: { plugins: [validate] } })
  })
  afterEach(() => {
    vi.restoreAllMocks()
    vi.resetAllMocks()
    cleanup()
  })
  test('フォームへの正常な文字列を入力時の挙動テスト', async () => {
    const user = userEvent.setup()
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: 'add-task' })
    await waitFor(() => {
      expect(input).toHaveFocus()
    })

    await user.type(input, 'new Task')
    expect(input).toHaveValue('new Task')
    await user.click(button)
    expect(input).toHaveValue('')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    expect(addTodoSpy).toHaveBeenCalledTimes(1)
    expect(addTodoSpy).toHaveBeenCalledWith('new Task')
    await waitFor(() => {
      expect(input).toHaveFocus()
    })
  })

  test('フォームへの空文字を入力時の挙動テスト', async () => {
    const user = userEvent.setup()
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: 'add-task' })
    await user.clear(input)
    await user.click(button)
    expect(screen.queryByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('タスク名は必須項目です。')).toBeInTheDocument()
  })

  test('フォームへの文字数超過の文字列を入力時の挙動テスト', async () => {
    const user = userEvent.setup()
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: 'add-task' })
    await user.type(
      input,
      '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901',
    )
    await user.click(button)
    expect(screen.queryByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('タスク名には100文字以下で入力してください。')).toBeInTheDocument()
  })
})
