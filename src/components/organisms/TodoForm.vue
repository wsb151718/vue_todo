<script setup>
import { nextTick, onMounted, ref, useTemplateRef } from 'vue'
import BaseInput from '../atoms/BaseInput.vue'
import ErrorMsg from '../atoms/ErrorMsg.vue'
import BaseButton from '../atoms/BaseButton.vue'
import { useValidator } from '@/plugins/validate'
import { useTodoList } from '@/composables/useTodoList'

defineOptions({
  inheritAttrs: false,
})
const { addTodo } = useTodoList()
const input = ref('')
const error = ref('')
const baseInputTemp = useTemplateRef('form-input')

const validate = useValidator()
function submitHandler() {
  error.value = ''

  error.value =
    validate({ value: input.value, text: 'タスク名' }, { required: true, maxLength: 100 })[0] ?? ''
  if (!error.value) {
    addTodo(input.value)
    input.value = ''

    baseInputTemp.value.focus()
  }
}

onMounted(async () => {
  await nextTick()
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
        aria-label="input-task"
      />
      <BaseButton type="submit" class="c-todoForm__add" aria-label="add-task">追加</BaseButton>
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
