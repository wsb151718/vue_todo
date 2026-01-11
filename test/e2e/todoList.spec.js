import { test, expect } from '@playwright/test'

async function addTask(page, text) {
  await page.getByRole('textbox', { name: 'input-task' }).fill(text)
  await page.getByRole('button', { name: 'add-task' }).click()
}

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173/')
})
test('初期アクセス時の表示テスト', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Vue Todo')
  await expect(page.getByText('表示件数 0件')).toBeVisible()

  // フィルターボタンチェック
  await expect(page.getByRole('button', { name: 'filter-task-all' })).toHaveClass(/active/)
  await expect(page.getByRole('button', { name: 'filter-task-unfinished' })).not.toHaveClass(
    /active/,
  )
  await expect(page.getByRole('button', { name: 'filter-task-finished' })).not.toHaveClass(/active/)
})

test('入力テスト', async ({ page }) => {
  // タスク一件追加
  await addTask(page, 'new task1')

  // 入力したばかりの状態のチェック
  await expect(page.getByRole('listitem').filter({ hasText: 'new task1' })).toHaveCount(1)
  await expect(
    page.getByRole('listitem').filter({ hasText: 'new task1' }).getByRole('checkbox'),
  ).not.toBeChecked()

  // さらに1件追加
  await addTask(page, 'new task2')

  // 入力したばかりの状態をチェック
  await expect(page.getByRole('listitem').filter({ hasText: 'new task2' })).toHaveCount(1)
  await expect(
    page.getByRole('listitem').filter({ hasText: 'new task2' }).getByRole('checkbox'),
  ).not.toBeChecked()
})

test('編集テスト', async ({ page }) => {
  //タスク一件追加
  await addTask(page, 'new task')

  // テキスト編集 Enterを押して確定した場合
  const row = page.getByRole('listitem').filter({ hasText: 'new task' })
  await row.getByText('new task').click()
  await row.getByRole('textbox').fill('change task')
  await row.getByRole('textbox').press('Enter')
  // 変更状態を確認
  await expect(page.getByRole('listitem').filter({ hasText: 'change task' })).toHaveCount(1)

  // テキスト編集 入力欄外をクリックしたとき
  await page.getByText('change task').click()
  await page
    .getByRole('listitem')
    .filter({ hasText: 'change task' })
    .getByRole('textbox')
    .fill('blured task')
  // 入力欄外をクリックしたとき
  await page.getByRole('listitem').filter({ hasText: 'change task' }).click()
  // 変更状態の確認
  await expect(page.getByRole('listitem').filter({ hasText: 'blured task' })).toHaveCount(1)
})

test('フィルターテスト', async ({ page }) => {
  // タスク2件追加
  await addTask(page, 'new task1')
  await addTask(page, 'new task2')

  const firstTask = await page.getByRole('listitem').filter({ hasText: 'new task1' })
  const secondTask = await page.getByRole('listitem').filter({ hasText: 'new task2' })
  await firstTask.getByRole('checkbox').check()
  await expect(firstTask.getByRole('checkbox')).toBeChecked()
  await expect(firstTask).toHaveClass(/disabled/)

  // 未完了タスクのみを表示
  await page.getByRole('button', { name: 'filter-task-unfinished' }).click()
  await expect(page.getByRole('button', { name: 'filter-task-all' })).not.toHaveClass(/active/)
  await expect(page.getByRole('button', { name: 'filter-task-unfinished' })).toHaveClass(/active/)
  await expect(page.getByRole('button', { name: 'filter-task-finished' })).not.toHaveClass(/active/)
  await expect(firstTask).toHaveCount(0)
  await expect(secondTask).toHaveCount(1)

  // 完了タスクのみを表示
  await page.getByRole('button', { name: 'filter-task-finished' }).click()
  await expect(page.getByRole('button', { name: 'filter-task-all' })).not.toHaveClass(/active/)
  await expect(page.getByRole('button', { name: 'filter-task-unfinished' })).not.toHaveClass(
    /active/,
  )
  await expect(page.getByRole('button', { name: 'filter-task-finished' })).toHaveClass(/active/)
  await expect(firstTask).toHaveCount(1)
  await expect(secondTask).toHaveCount(0)
})

test('削除テスト', async ({ page }) => {
  // タスクを3件追加
  await addTask(page, 'new task1')
  await addTask(page, 'new task2')
  await addTask(page, 'new task3')

  const firstTask = page.getByRole('listitem').filter({ hasText: 'new task1' })
  const secondTask = page.getByRole('listitem').filter({ hasText: 'new task2' })
  const thirdTask = page.getByRole('listitem').filter({ hasText: 'new task3' })

  // 完了済みタスクを設定
  await firstTask.getByRole('checkbox').check()
  await expect(firstTask.getByRole('checkbox')).toBeChecked()
  await secondTask.getByRole('checkbox').check()
  await expect(secondTask.getByRole('checkbox')).toBeChecked()

  // 一括削除ボタンをクリック
  await page.once('dialog', async (dialog) => {
    console.log(`Dialog message: ${dialog.message()}`)
    dialog.accept().catch(() => {})
  })
  await page.getByRole('button', { name: 'all-delete' }).click()
  // 完了済みタスクのみ削除されていることを確認
  await expect(firstTask).toHaveCount(0)
  await expect(secondTask).toHaveCount(0)
  await expect(thirdTask).toHaveCount(1)
})
