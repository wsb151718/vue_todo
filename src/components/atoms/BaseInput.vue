<script setup>
import { useTemplateRef } from 'vue'

defineProps({
  placeholder: { type: String, default: '' },
  isFocus: Boolean,
})
const input = defineModel({ type: String })
const inputComponent = useTemplateRef('input-text')
function focus() {
  inputComponent.value.focus()
}

defineExpose({ focus })
</script>

<template>
  <input ref="input-text" v-model="input" type="text" class="c-input" :placeholder="placeholder" />
</template>

<style scoped>
.c-input {
  background-color: #eff3f5;
  border-radius: 8px;
  border: 1px solid #aaa;
  font-size: 1.4rem;
  padding: 6px;

  &:placeholder-shown {
    color: #aaa;
  }
}
</style>
