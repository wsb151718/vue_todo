import { useTodo } from '@/composables/useTodo'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { ref } from 'vue'

vi.mock('@/composables/useLocalStorage', () => {
  return {
    useLocalStorage: vi.fn((key, defaultValue) => {
      return ref(defaultValue)
    }),
  }
})

function setupTodoWithTexts(texts = ['stringA', 'stringB', 'stringC']) {
  const composable = useTodo()
  texts.forEach(composable.addTodo)
  return composable
}

describe('init value test', () => {
  test('初期値', () => {
    const { lastInsertId, todoList } = useTodo()

    expect(lastInsertId.value).toBe(0)
    expect(todoList.value).toEqual([])
  })
})

describe('addTodo', () => {
  test('文字列からTODOを作成する', () => {
    const { lastInsertId, todoList, addTodo } = useTodo()

    addTodo('stringA')
    expect(lastInsertId.value).toBe(1)
    expect(todoList.value).toEqual([{ id: 1, text: 'stringA', finished: false }])

    addTodo('stringB')
    expect(lastInsertId.value).toBe(2)
    expect(todoList.value).toEqual([
      { id: 1, text: 'stringA', finished: false },
      { id: 2, text: 'stringB', finished: false },
    ])
  })
})

describe('deleteTodo', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })
  test('confirmが承認されると対象TODOを削除する', () => {
    const { lastInsertId, todoList, deleteTodo } = setupTodoWithTexts()

    vi.stubGlobal(
      'confirm',
      vi.fn(() => true),
    )
    deleteTodo(todoList.value[1])
    // 削除してもlastInsertIdは変化なし
    expect(lastInsertId.value).toBe(3)
    expect(todoList.value).toEqual([
      { id: 1, text: 'stringA', finished: false },
      { id: 3, text: 'stringC', finished: false },
    ])
    expect(confirm).toHaveBeenCalledWith('本当に削除しますか?')

    deleteTodo(todoList.value.find((t) => t.text === 'stringC'))
    deleteTodo(todoList.value.find((t) => t.text === 'stringA'))
    expect(lastInsertId.value).toBe(3)
    expect(todoList.value).toEqual([])
  })

  test('confirmがキャンセルされると削除しない', () => {
    const { lastInsertId, todoList, deleteTodo } = setupTodoWithTexts(['stringA'])
    vi.stubGlobal('confirm', vi.fn().mockImplementation(false))
    deleteTodo(todoList.value[0])

    expect(lastInsertId.value).toBe(1)
    expect(todoList.value).toEqual([{ id: 1, text: 'stringA', finished: false }])
    expect(confirm).toHaveBeenCalledWith('本当に削除しますか?')
  })
})

describe('editTodoText', () => {
  test('文字列を入力後対象のタスクの文字列が変わる', () => {
    const { lastInsertId, todoList, editTodoText } = setupTodoWithTexts()

    editTodoText(todoList.value[0], '変更後文字列')

    expect(lastInsertId.value).toBe(3)
    expect(todoList.value[0]).toEqual({ id: 1, text: '変更後文字列', finished: false })
  })
  test('空文字入力をしても文字列が変わる', () => {
    const { lastInsertId, todoList, editTodoText } = setupTodoWithTexts()

    editTodoText(todoList.value[1], '')

    expect(lastInsertId.value).toBe(3)
    expect(todoList.value[1]).toEqual({ id: 2, text: '', finished: false })
  })
})

describe('toggleStatus', () => {
  test('完了・未完了状態が入れ替わる', () => {
    const { lastInsertId, todoList, toggleStatus } = setupTodoWithTexts(['textA'])

    expect(todoList.value[0].finished).toBe(false)
    toggleStatus(todoList.value[0])
    expect(todoList.value[0].finished).toBe(true)
    // その他の状態が変更されていないことを確認
    expect(lastInsertId.value).toBe(1)
    expect(todoList.value[0]).toEqual({ id: 1, text: 'textA', finished: true })

    toggleStatus(todoList.value[0])
    expect(todoList.value[0].finished).toBe(false)
  })

  test('無効なidを持つタスクを無視する', () => {
    const { lastInsertId, todoList, toggleStatus } = setupTodoWithTexts(['textA'])

    toggleStatus({ id: 2, text: 'string', finished: false })
    expect(lastInsertId.value).toBe(1)
    expect(todoList.value).toEqual([{ id: 1, text: 'textA', finished: false }])
  })
  test('無効な値の形式を無視する', () => {
    const { lastInsertId, todoList, toggleStatus } = setupTodoWithTexts(['textA'])

    toggleStatus('id:1')
    expect(lastInsertId.value).toBe(1)
    expect(todoList.value).toEqual([{ id: 1, text: 'textA', finished: false }])
  })
})

describe('deleteTodos', () => {
  const confirmFn = vi.fn()
  beforeEach(() => {
    vi.stubGlobal('confirm', confirmFn)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    vi.resetAllMocks()
  })
  test('status: all を指定した場合', () => {
    const { lastInsertId, todoList, deleteTodos } = setupTodoWithTexts([
      'textA',
      'textB',
      'textC',
      'textD',
      'textE',
    ])
    todoList.value[0].finished = true
    todoList.value[1].finished = true
    todoList.value[4].finished = true
    confirmFn.mockReturnValueOnce(true)
    deleteTodos('all')

    expect(lastInsertId.value).toBe(5)
    expect(todoList.value).toEqual([])
    expect(confirm).toHaveBeenCalledWith('タスクを全て削除しますか?')
  })
  test('status: finished を指定した場合', () => {
    const { lastInsertId, todoList, deleteTodos } = setupTodoWithTexts([
      'textA',
      'textB',
      'textC',
      'textD',
      'textE',
    ])
    todoList.value[0].finished = true
    todoList.value[1].finished = true
    todoList.value[4].finished = true
    confirmFn.mockReturnValueOnce(true)
    deleteTodos('finished')

    expect(lastInsertId.value).toBe(5)
    expect(todoList.value).toEqual([
      { id: 3, text: 'textC', finished: false },
      { id: 4, text: 'textD', finished: false },
    ])
    expect(confirm).toHaveBeenCalledWith('完了済タスクを全て削除しますか?')
  })
  test('status: unfinished を指定した場合', () => {
    const { lastInsertId, todoList, deleteTodos } = setupTodoWithTexts([
      'textA',
      'textB',
      'textC',
      'textD',
      'textE',
    ])
    todoList.value[0].finished = true
    todoList.value[1].finished = true
    todoList.value[4].finished = true
    confirmFn.mockReturnValueOnce(true)
    deleteTodos('unfinished')

    expect(lastInsertId.value).toBe(5)
    expect(todoList.value).toEqual([
      { id: 1, text: 'textA', finished: true },
      { id: 2, text: 'textB', finished: true },
      { id: 5, text: 'textE', finished: true },
    ])
    expect(confirm).toHaveBeenCalledWith('未完了タスクを全て削除しますか?')
  })
  test('無効なステータス を指定した場合', () => {
    const { lastInsertId, todoList, deleteTodos } = setupTodoWithTexts([
      'textA',
      'textB',
      'textC',
      'textD',
      'textE',
    ])
    todoList.value[0].finished = true
    todoList.value[1].finished = true
    todoList.value[4].finished = true
    confirmFn.mockReturnValueOnce(true)
    deleteTodos('completed')

    expect(lastInsertId.value).toBe(5)
    expect(todoList.value).toEqual([
      { id: 1, text: 'textA', finished: true },
      { id: 2, text: 'textB', finished: true },
      { id: 3, text: 'textC', finished: false },
      { id: 4, text: 'textD', finished: false },
      { id: 5, text: 'textE', finished: true },
    ])
    expect(confirm).not.toHaveBeenCalled()
  })
})
