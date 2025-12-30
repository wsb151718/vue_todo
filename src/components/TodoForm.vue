<script setup>
import { onMounted, ref, useTemplateRef } from 'vue'
import FormInput from './FormInput.vue'
import ErrorMsg from './ErrorMsg.vue'

const emits = defineEmits(['add'])
const input = ref('')
const error = ref('')
const formInputTemp = useTemplateRef('form-input')

function submitHandler(e) {
  error.value = ''
  if (input.value.length === 0) {
    error.value = '1文字以上入力してください。'
    return
  }
  emits('add', input.value)

  input.value = ''
  console.log(formInputTemp.value)

  formInputTemp.value.focus()
}

onMounted(() => {
  formInputTemp.value.focus()
})
</script>

<template>
  <div class="c-todoForm">
    <form action="" method="post" class="c-todoForm__form" @submit.prevent.trim="submitHandler">
      <FormInput
        placeholder="新規タスクをここに追加"
        class="c-todoInput"
        v-model.trim="input"
        :is-focus="true"
        ref="form-input"
      />
      <button type="submit" class="c-todoForm__add">追加</button>
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
  /* height: 35px; */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--main);
  color: #fff;
  padding: 8px;
  font-size: 1.2rem;
  border-radius: 4px;

  &:hover {
    opacity: 0.75;
  }
}
</style>
