import { ref } from 'vue'

export function useTodoFilter() {
  const isFilter = ref(false)
  const isFinished = ref(false)
  const filterList = ref([
    { status: 'all', isFilter: false, isFinished: false },
    { status: 'unfinished', isFilter: true, isFinished: false },
    { status: 'finished', isFilter: true, isFinished: true },
  ])
  function changeFilter(filtered, finished) {
    isFilter.value = filtered
    isFinished.value = finished
  }

  return { isFilter, isFinished, filterList, changeFilter }
}
