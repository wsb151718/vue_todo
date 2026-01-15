<script setup>
import BaseModal from '../atoms/BaseModal.vue'
import BaseButton from '../atoms/BaseButton.vue'
import BaseInput from '../atoms/BaseInput.vue'
import ErrorMsg from '../atoms/ErrorMsg.vue'
import { ref, watch } from 'vue'
import { useValidator } from '@/plugins/validate'

const todo = defineModel('todo', {
  type: Object,
  default: () => ({ id: -1, text: '' }),
  validator(value) {
    if (typeof value !== 'object') {
      return false
    }

    if (!(Object.hasOwn(value, 'id') && Object.hasOwn(value, 'text'))) {
      return false
    }

    return true
  },
})

const isModalOpen = defineModel('isOpen', { type: Boolean })
const input = ref(todo.value.text)
watch(
  () => todo.value.text,
  () => {
    input.value = todo.value.text
  },
)

const emits = defineEmits({
  deleteItem: null,
  editItem: (text) => {
    if (!text || typeof text !== 'string') {
      return false
    }

    return true
  },
})

const validate = useValidator()
const error = ref({})
function submitHandler() {
  error.value = {}
  // Todo TodoItemと同じバリデーションなので、バリデーションルールをどこかに一元化する。
  error.value.title =
    validate({ value: input.value, text: 'タスク名' }, { required: true, maxLength: 100 })[0] ?? ''

  // Todo タイトルだけでエラーを判定するのではなく、他のすべての項目でバリデーションエラーがないか判定できるようにする。
  if (!error.value.title) {
    input.value = input.value.trim()
    emits('editItem', input.value)
  }
}

function deleteHandler() {
  // モーダルを閉じる
  emits('deleteItem')
  isModalOpen.value = false
}
</script>

<template>
  <Transition name="fade">
    <BaseModal v-if="isModalOpen" v-model="isModalOpen">
      <template #header>
        <div class="c-modal__heading">
          <h3 class="c-modal__title">{{ todo.text }}</h3>
          <BaseButton is-alert @click="deleteHandler">削除</BaseButton>
        </div>
      </template>
      <div class="c-modal__main">
        <form class="c-form" action="" @submit.prevent="submitHandler">
          <dl class="c-form-row">
            <dt>
              <label for="modal-todo-task">タスク名: </label>
            </dt>
            <dd>
              <BaseInput id="modal-todo-task" v-model.lazy.trim="input" />
              <ErrorMsg>
                {{ error.title }}
              </ErrorMsg>
            </dd>
          </dl>
          <div class="c-form__buttons">
            <BaseButton class="c-form__button--edit" type="submit">編集</BaseButton>
          </div>
        </form>
      </div>
    </BaseModal>
  </Transition>
</template>

<style scoped>
.c-modal__heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.c-modal__title {
  font-size: 2.4rem;
}
.c-modal__main {
}
.c-form-row {
  --gap: 20px;
  --labelW: 100px;
  width: 80%;
  display: flex;
  align-items: center;
  flex-flow: wrap;
  gap: var(--gap);
  margin-bottom: 20px;

  & dt {
    flex: 0 var(--labelW);
    font-size: 1.4rem;
  }
  & dd {
    flex: 1 calc(100% - (var(--labelW) + var(--gap)));
  }
}
.c-form__buttons {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 10px;
}
.c-form__button--edit {
  width: 60px;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}
</style>
