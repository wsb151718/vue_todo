import TodoItem from '@/components/molecules/TodoItem.vue'
import validate from '@/plugins/validate'
import { cleanup, render, screen } from '@testing-library/vue'
import { afterEach, describe, expect, test } from 'vitest'
import { userEvent } from 'vitest/browser'

describe('user interactive test', () => {
  afterEach(() => cleanup())
  test('活性時に与えられたデータと表示が一致するか', () => {
    render(TodoItem, {
      props: {
        text: '活性',
        id: 1,
        finished: false,
      },
      global: {
        plugins: [validate],
      },
    })

    expect(screen.getByText('活性')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })
  test('非活性時に与えられたデータと表示が一致するか', () => {
    render(TodoItem, {
      props: {
        text: '非活性',
        id: 1,
        finished: true,
      },
      global: {
        plugins: [validate],
      },
    })

    expect(screen.getByText('非活性')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeChecked()
  })
  test('テキストをクリックしたときに1文字以上の文字列の入力が反映されるか', async () => {
    const { emitted } = render(TodoItem, {
      props: {
        text: '初期値',
        id: 1,
        finished: true,
      },
      global: {
        plugins: [validate],
      },
    })

    const user = userEvent.setup()
    const text = screen.getByText('初期値')
    await user.click(text)
    const input = screen.getByRole('textbox')
    expect(text).not.toBeVisible()
    expect(input).toBeVisible()
    expect(input).toHaveValue('初期値')

    await user.clear(input)
    await user.type(input, '変更値')
    expect(input).toHaveValue('変更値')

    await user.keyboard('{Enter}')
    expect(input).not.toBeVisible()
    expect(emitted()).toHaveProperty('editItem')
    expect(emitted().editItem.at(-1)).toEqual(['変更値'])

    await user.click(text)
    await user.clear(input)
    await user.type(input, '変更値2回目')
    expect(input).toHaveValue('変更値2回目')

    await user.tab()

    expect(input).not.toBeVisible()
    expect(emitted().editItem.at(-1)).toEqual(['変更値2回目'])
  })

  test('テキスト入力時にバリデーションエラーが発生しているか', async () => {
    const { emitted } = render(TodoItem, {
      props: {
        text: '初期値',
        id: 1,
        finished: true,
      },
      global: {
        plugins: [validate],
      },
    })

    const user = userEvent.setup()
    await user.click(screen.getByText('初期値'))
    const input = screen.getByRole('textbox')
    await user.clear(input)

    await user.keyboard('{Enter}')
    expect(input).toBeVisible()
    expect(screen.getByRole('alert')).toHaveTextContent('タスク名は必須項目です。')
    expect(emitted()).not.toHaveProperty('editItem')

    await user.type(
      input,
      '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901',
    )
    await user.keyboard('{Enter}')
    expect(input).toBeVisible()
    expect(screen.getByRole('alert')).toHaveTextContent(
      'タスク名には100文字以下で入力してください。',
    )
    expect(emitted()).not.toHaveProperty('editItem')

    await user.clear(input)
    await user.type(input, '正常値')
    await user.keyboard('{Enter}')

    expect(input).not.toBeVisible()
    expect(emitted()).toHaveProperty('editItem')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  test('削除イベントが発生しているか', async () => {
    const { emitted } = render(TodoItem, {
      props: {
        text: '初期値',
        id: 1,
        finished: true,
      },
      global: {
        plugins: [validate],
      },
    })

    const user = userEvent.setup()
    const button = screen.getByRole('button', { name: 'delete' })

    await user.click(button)
    expect(emitted()).toHaveProperty('deleteItem')
  })
})
