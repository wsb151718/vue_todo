<script setup>
import { useTemplateRef } from 'vue'

const props = defineProps(['placeholder', 'isFocus'])
const emits = defineEmits([''])
const input = defineModel()
const inputComponent = useTemplateRef('input-text')
function focus() {
  inputComponent.value.focus()
}

defineExpose({ focus })
</script>

<template>
  <input type="text" class="c-input" :placeholder="placeholder" v-model="input" ref="input-text" />
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
