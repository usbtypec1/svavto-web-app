<template>
  <div v-auto-animate>
    <Fieldset :legend="`Кнопка №${index + 1}`" v-for="(button, index) in buttons" :key="button.id">
      <div class="flex flex-col">
        <label>Текст</label>
        <InputText v-model.trim="button.text"/>
        <Message
          v-for="error in button.textErrors"
          :key="error"
          severity="error"
          class="my-3"
        >
          {{ error }}
        </Message>
      </div>
      <div class="flex flex-col">
        <label>URL</label>
        <InputText v-model.trim="button.url"/>
        <Message
          v-for="error in button.urlErrors"
          :key="error"
          severity="error"
          class="mt-3"
        >
          {{ error }}
        </Message>
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
    icon="pi pi-plus"
    label="Добавить кнопку"
    @click="onCreateButton"
    :disabled="buttons.length > 10"
  />
  <Message
    v-if="buttons.length > 10"
    severity="warn"
  >
    Слишком много кнопок (макс. 10)
  </Message>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import type { Button } from '~/reply-markup'
import { validateUrl } from '~/services/url'

const buttons = defineModel<Button[]>('buttons', { required: true })

const isLengthInRange = (text: string, minLength: number, maxLength: number): boolean => {
  return text.length >= minLength && text.length < maxLength
}

watchEffect(() => {
  buttons.value.forEach((button: Button): void => {
    button.textErrors = []
    button.urlErrors = []
    const urlError = validateUrl(button.url)
    if (button.text === null || button.text === '') {
      button.textErrors.push('Отсутствует текст')
    } else if (!isLengthInRange(button.text, 1, 64)) {
      button.textErrors.push('Слишком длинный текст')
    }
    if (urlError !== null) {
      button.urlErrors.push(urlError)
    }
  })
})

const deleteButton = (id: string): void => {
  buttons.value = buttons.value.filter(button => button.id !== id)
}

const onCreateButton = () => {
  buttons.value.push({
    id: uuidv4(),
    text: null,
    url: null,
    textErrors: [],
    urlErrors: [],
  })
}
</script>
