<template>
  <div v-auto-animate>
    <Fieldset :legend="`Кнопка №${index + 1}`" v-for="(button, index) in buttons" :key="button.id">
      <div class="flex flex-col">
        <label>Текст</label>
        <InputText v-model.trim="button.text"/>
      </div>
      <div class="flex flex-col">
        <label>URL</label>
        <InputText v-model.trim="button.url"/>
      </div>
      <Button
        @click="deleteButton(button.id)"
        class="w-full mt-3"
        text
        severity="danger"
        icon="pi pi-trash"
        label="Удалить"
      />
    </Fieldset>
  </div>
  <Button
    class="w-full my-3"
    icon="pi pi-plus" label="Добавить кнопку" @click="onCreateButton"
  />
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import type { Button } from '~/reply-markup'

const buttons = defineModel<Button[]>('buttons', { required: true })

const deleteButton = (id: string): void => {
  buttons.value = buttons.value.filter(button => button.id !== id)
}

const onCreateButton = () => {
  buttons.value.push({
    id: uuidv4(),
    text: null,
    url: null,
  })
}
</script>
