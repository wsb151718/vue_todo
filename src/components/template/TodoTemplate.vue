<script setup>
import TodoList from '../organisms/TodoList.vue'
import TodoHeader from '../organisms/TodoHeader.vue'
</script>

<template>
  <div class="c-todoBox">
    <TodoHeader></TodoHeader>
    <TodoList></TodoList>
  </div>
</template>

<style scoped>
.c-todoBox {
  background-color: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0px 5px 10px #aaa;
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translate(-50%);
  width: 500px;
}
</style>
