<script setup>
import { nextTick, ref, useTemplateRef, watch } from 'vue'
import ToggleItem from '../atoms/BaseToggle.vue'
import BaseCircleButton from '../atoms/BaseCircleButton.vue'
import BaseInput from '../atoms/BaseInput.vue'
import ErrorMsg from '../atoms/ErrorMsg.vue'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  finished: Boolean,
})
const emits = defineEmits(['toggleState', 'deleteItem', 'editItem'])

const toggleModel = ref(props.finished)
const isEditable = ref(false)
const baseInputTemp = useTemplateRef('form-input')
const input = ref(props.text)
const error = ref('')
watch(toggleModel, () => {
  emits('toggleState')
})
async function changeMode(editable) {
  isEditable.value = editable

  if (editable) {
    await nextTick()
    baseInputTemp.value.focus()
  }
}
function editText() {
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
          ref="form-input"
          v-model.trim="input"
          class="c-todoItem__input"
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
