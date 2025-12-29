<script setup>
import ToggleItem from './ToggleItem.vue'

const props = defineProps(['text'])
</script>

<template>
  <li class="c-todoItem">
    <div class="c-todoItem__main">
      <p class="c-todoItem__text">{{ text }}</p>
      <input type="text" class="c-todoItem__input" />
    </div>
    <div class="c-todoItem__parts">
      <ToggleItem />
      <button class="c-minusButton"></button>
    </div>
  </li>
</template>

<style scoped>
.c-todoItem {
  font-size: 1.4rem;
  border-radius: 8px;
  border: 1px solid #aaa;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.c-todoItem__input {
  display: none;
}

.c-todoItem__parts {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.c-minusButton {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--alert);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40%;
    height: 2px;
    background-color: #fff;
  }

  &:hover {
    opacity: 0.7;
  }
}
</style>
