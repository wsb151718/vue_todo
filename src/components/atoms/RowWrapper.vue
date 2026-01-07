<script setup>
const props = defineProps({
  gap: {
    type: String,
    default: '10px',
  },
  isWrap: {
    type: Boolean,
  },
  align: {
    type: String,
    default: 'flex-start',
  },
  justifyContent: {
    type: String,
    default: 'center',
  },
})

const style = {
  gap: props.gap,
  flexWrap: props.isWrap ? 'wrap' : 'nowrap',
  alignItems: props.align,
  justifyContent: props.justifyContent,
}
</script>

<template>
  <ul class="l-rowWrapper" :style="style">
    <slot></slot>
  </ul>
</template>

<style scoped>
.l-rowWrapper {
  display: flex;
  flex-direction: row;
}
</style>
