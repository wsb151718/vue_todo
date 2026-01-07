<script setup>
import { inject, onMounted, ref, useTemplateRef } from 'vue'
import BaseInput from '../atoms/BaseInput.vue'
import ErrorMsg from '../atoms/ErrorMsg.vue'
import BaseButton from '../atoms/BaseButton.vue'
import { todoListInjectKey } from '@/keys/keys'

defineOptions({
  inheritAttrs: false,
})
const { addTodo } = inject(todoListInjectKey)
const input = ref('')
const error = ref('')
const baseInputTemp = useTemplateRef('form-input')

function submitHandler() {
  error.value = ''
  if (input.value.length === 0) {
    error.value = '1文字以上入力してください。'
    return
  }
  addTodo(input.value)

  input.value = ''

  baseInputTemp.value.focus()
}

onMounted(() => {
  baseInputTemp.value.focus()
})
</script>

<template>
  <div class="c-todoForm">
    <form
      action=""
      method="post"
      class="c-todoForm__form"
      v-bind="$attrs"
      @submit.prevent="submitHandler"
    >
      <BaseInput
        ref="form-input"
        v-model.trim="input"
        placeholder="新規タスクをここに追加"
        class="c-todoInput"
        :is-focus="true"
      />
      <BaseButton type="submit" class="c-todoForm__add">追加</BaseButton>
    </form>
    <ErrorMsg v-show="error.length">
      {{ error }}
    </ErrorMsg>
  </div>
</template>

<style scoped>
.c-todoForm {
  margin-bottom: 10px;
}
.c-todoForm__form {
  width: 100%;
  display: flex;
  gap: 15px;
}
.c-todoInput {
  flex: 1;
}
.c-todoForm__add {
  width: 40px;
}
</style>
