import { useTodoFilter } from '@/composables/useTodoFilter'
import { describe, expect, test } from 'vitest'

describe('useTodoFilter', () => {
  test('初期値テスト', () => {
    const { isFilter, isFinished, filterList } = useTodoFilter()

    expect(isFilter.value).toBe(false)
    expect(isFinished.value).toBe(false)
    expect(filterList.value).toEqual([
      { status: 'all', isFilter: false, isFinished: false },
      { status: 'unfinished', isFilter: true, isFinished: false },
      { status: 'finished', isFilter: true, isFinished: true },
    ])
  })

  test('changeFilterでisFilterとisFinishedが更新される', () => {
    const { isFilter, isFinished, changeFilter } = useTodoFilter()
    changeFilter(true, true)

    expect(isFilter.value).toBe(true)
    expect(isFinished.value).toBe(true)

    changeFilter(false, false)

    expect(isFilter.value).toBe(false)
    expect(isFinished.value).toBe(false)
  })
})
