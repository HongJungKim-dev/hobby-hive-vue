import { defineStore } from 'pinia'

export const useUploadModalStore = defineStore('uploadModal', {
  state: () => ({
    isUploadModalOpen: false,
  }),
  actions: {
    openUploadModal() {
      this.isUploadModalOpen = true
    },
    closeUploadModal() {
      this.isUploadModalOpen = false
    },
  },
})
