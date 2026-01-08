<script setup>
import TrashIcon from '../icon/TrashIcon.vue'
import TodoForm from './TodoForm.vue'
import BaseCapsuelButton from '../atoms/BaseCapsuelButton.vue'
import { inject } from 'vue'
import RowWrapper from '../atoms/RowWrapper.vue'
import { todoListInjectKey } from '@/keys/keys'

defineOptions({
  inheritAttrs: false,
})

const { deleteTodos, isFilter, isFinished, changeFilter, filterList, todoList } =
  inject(todoListInjectKey)
const ButtonStatusMap = new Map([
  ['all', '全て'],
  ['unfinished', '未完了'],
  ['finished', '完了'],
])
</script>

<template>
  <RowWrapper justify-content="space-between" class="c-heading">
    <h1 class="c-heading__title">{{ $APP_NAME }}</h1>
    <p>表示件数 {{ todoList.length }}件</p>
  </RowWrapper>
  <TodoForm></TodoForm>
  <RowWrapper justify-content="space-between" class="p-itemWrapper">
    <RowWrapper>
      <li v-for="filter in filterList" :key="filter.status">
        <BaseCapsuelButton
          v-if="ButtonStatusMap.has(filter.status)"
          :is-active="isFilter === filter.isFilter && isFinished === filter.isFinished"
          @click-handler="changeFilter(filter.isFilter, filter.isFinished)"
        >
          {{ ButtonStatusMap.get(filter.status) }}
        </BaseCapsuelButton>
      </li>
    </RowWrapper>

    <BaseCapsuelButton :is-active="true" :is-alert="true" @click-handler="deleteTodos('finished')"
      ><TrashIcon class="icon" />削除
    </BaseCapsuelButton>
  </RowWrapper>
</template>

<style scoped>
.p-itemWrapper {
  margin-bottom: 20px;
}
.c-heading {
  margin-bottom: 20px;
  font-size: 12px;
}
.c-heading__title {
  font-size: 2.2rem;
  font-weight: bold;
}
</style>
