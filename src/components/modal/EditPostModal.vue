<template>
  <EditModal :isOpen="true" :onClose="onClose" :editMode="true" :initialData="file" />
</template>

<script setup>
import EditModal from './EditModal.vue'

defineProps({
  file: {
    type: Object,
    required: true,
  },
  onClose: {
    type: Function,
    required: true,
  },
})
</script>
