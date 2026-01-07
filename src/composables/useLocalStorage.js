import { ref, toValue, watch } from 'vue'

export function useLocalStorage(key, defaultValue = null) {
  const data = ref()
  try {
    const storageData = localStorage.getItem(toValue(key))
    data.value = storageData ? JSON.parse(storageData) : toValue(defaultValue)
  } catch (error) {
    alert('データの取得に失敗しました。')
    console.error(error)
  }

  watch(
    data,
    (newData) => {
      try {
        localStorage.setItem(toValue(key), JSON.stringify(newData))
      } catch (error) {
        alert('データの保存に失敗しました。')
        console.error(error)
      }
    },
    { deep: true },
  )

  return data
}
