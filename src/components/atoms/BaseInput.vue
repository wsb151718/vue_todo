<script setup>
import { useTemplateRef, ref, watch } from 'vue'

defineProps({
  placeholder: { type: String, default: '' },
})
const [inputModel, modifired] = defineModel({ type: String })
const inputValue = ref(inputModel.value ?? '')
const inputComponent = useTemplateRef('input-text')
function focus() {
  inputComponent.value.focus()
}

function inputHandler(event) {
  inputValue.value = event.target.value
  if (!modifired.lazy) {
    inputModel.value = inputValue.value
  }
}

function changeHandler() {
  if (modifired.lazy) {
    inputModel.value = inputValue.value
  }
}

watch(inputModel, (value) => {
  inputValue.value = value ?? ''
})

defineExpose({ focus })
</script>

<template>
  <input
    ref="input-text"
    :value="inputValue"
    type="text"
    class="c-input"
    :placeholder="placeholder"
    @input="inputHandler"
    @change="changeHandler"
  />
</template>

<style scoped>
.c-input {
  background-color: #eff3f5;
  border-radius: 8px;
  border: 1px solid #aaa;
  font-size: 1.4rem;
  padding: 6px;
  width: 100%;

  &:placeholder-shown {
    color: #aaa;
  }
}
</style>
