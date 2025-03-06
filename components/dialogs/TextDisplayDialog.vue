<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Сообщение"
    class="mx-3"
  >
    <div v-if="status === 'pending'" class="flex justify-center items-center">
      <ProgressSpinner />
    </div>
    <div v-else-if="status === 'success'">
      <p v-html="formattedTextValue"></p>
    </div>
    <div v-else-if="status === 'error'">
      <p>Ошибка загрузки текста</p>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  textKey: string
}>()

interface Text {
  key: string
  value: string
}

const visible = defineModel<boolean>("visible", { default: false })

const runtimeConfig = useRuntimeConfig()
const query = computed(() => ({ key: props.textKey }))
const { data, status, refresh } = useFetch<Text>("/texts/", {
  baseURL: runtimeConfig.public.apiBaseUrl,
  query,
  immediate: false,
})

const formattedTextValue = computed((): string => {
  if (data?.value) {
    return data.value.value.replace(/\n/g, "<br>")
  }
  return ""
})

watch(query, async () => await refresh)
</script>
