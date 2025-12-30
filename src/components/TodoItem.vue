<script setup>
import { ErrorCodes, nextTick, ref, useTemplateRef, watch } from 'vue'
import ToggleItem from './BaseToggle.vue'
import BaseCircleButton from './BaseCircleButton.vue'
import BaseInput from './BaseInput.vue'
import ErrorMsg from './ErrorMsg.vue'

const props = defineProps(['text', 'id', 'finished'])
const emits = defineEmits(['changeFinished', 'deleteItem', 'editItem'])

const toggleModel = ref(props.finished)
const isEditable = ref(false)
const baseInputTemp = useTemplateRef('form-input')
const input = ref(props.text)
const error = ref('')
watch(toggleModel, () => {
  emits('changeFinished')
})
async function changeMode(editable) {
  isEditable.value = editable

  if (editable) {
    await nextTick()
    baseInputTemp.value.focus()
  }
}
function editText(e) {
  error.value = ''
  if (input.value.length === 0) {
    error.value = '1文字以上入力してください。'
    return
  }
  emits('editItem', input.value)
  isEditable.value = false
}
</script>

<template>
  <li class="c-todoItem" :class="{ disabled: finished, editable: isEditable }">
    <div class="c-todoItem__main">
      <p class="c-todoItem__text" @click="changeMode(true)">{{ text }}</p>
      <div class="c-todoItem__inputWrap">
        <BaseInput
          class="c-todoItem__input"
          v-model.trim="input"
          ref="form-input"
          @keydown.enter="editText"
          @keydown.esc="() => changeMode(false)"
          @blur="editText"
        ></BaseInput>
        <ErrorMsg>
          {{ error }}
        </ErrorMsg>
      </div>
    </div>
    <div class="c-todoItem__parts">
      <ToggleItem v-model="toggleModel" />
      <BaseCircleButton :is-delete="true" @click-handler="$emit('deleteItem')"></BaseCircleButton>
    </div>
  </li>
</template>

<style scoped>
.c-todoItem {
  font-size: 1.4rem;
  border-radius: 8px;
  border: 1px solid currentColor;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.25s ease;
  &.disabled {
    color: #aaa;
    & .c-todoItem__text {
      text-decoration: line-through;
    }
  }

  &.editable {
    & .c-todoItem__text {
      display: none;
    }
    & .c-todoItem__inputWrap {
      display: block;
    }
  }
}
.c-todoItem__inputWrap {
  display: none;
}
.c-todoItem__parts {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}
</style>
