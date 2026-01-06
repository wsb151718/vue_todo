<script setup>
import TrashIcon from '../icon/TrashIcon.vue'
import TodoForm from '../molecules/TodoForm.vue'
import BaseCapsuelButton from '../atoms/BaseCapsuelButton.vue'

defineOptions({
  inheritAttrs: false,
})

defineProps({
  showCount: {
    type: Number,
    required: true,
  },
  buttons: {
    type: Array,
    required: true,
  },
  isFilter: Boolean,
  isFinished: Boolean,
})
defineEmits({
  addTodo: null,
  deleteTodos: null,
  filterTodo: (button) => {
    if (button && Object.hasOwn(button, 'isFinished') && Object.hasOwn(button, 'isFilter')) {
      return true
    }
    return false
  },
})
</script>

<template>
  <div class="c-heading">
    <h1 class="c-heading__title">Vue Todo</h1>
    <p>表示件数 {{ showCount }}件</p>
  </div>
  <TodoForm @add="(text) => $emit('addTodo', text)"></TodoForm>
  <div class="p-itemWrapper">
    <ul class="c-buttonList">
      <li v-for="button in buttons" :key="button.text">
        <BaseCapsuelButton
          :is-active="isFilter === button.isFilter && isFinished === button.isFinished"
          :is-alert="false"
          @click-handler="$emit('filterTodo', button)"
        >
          {{ button.text }}
        </BaseCapsuelButton>
      </li>
    </ul>
    <BaseCapsuelButton :is-active="true" :is-alert="true" @click-handler="$emit('deleteTodos')"
      ><TrashIcon class="icon" />削除
    </BaseCapsuelButton>
  </div>
</template>

<style scoped>
.p-itemWrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.c-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 12px;
}
.c-heading__title {
  font-size: 2.2rem;
  font-weight: bold;
}
.c-buttonList {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
