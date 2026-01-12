<script setup>
import TodoList from '../organisms/TodoList.vue'
import TodoHeader from '../organisms/TodoHeader.vue'
</script>

<template>
  <main>
    <div class="c-todoBox">
      <TodoHeader></TodoHeader>
      <TodoList></TodoList>
    </div>
  </main>
</template>

<style scoped>
.c-todoBox {
  background-color: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0px 5px 10px #aaa;
  margin-inline: auto;
  width: 500px;
}
main {
  padding-top: 100px;
}
</style>
