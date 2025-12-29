<script setup>
import FormInput from './FormInput.vue'
</script>

<template>
  <form action="" method="post" class="c-todoForm">
    <FormInput placeholder="新規タスクをここに追加" class="c-todoInput"></FormInput>
    <button type="submit" class="c-todoForm__add">追加</button>
  </form>
</template>

<style scoped>
.c-todoForm {
  width: 100%;
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
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
}
</style>
