import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state: () => ({
    isLoginModalOpen: false,
  }),
  actions: {
    openLoginModal() {
      this.isLoginModalOpen = true
    },
    closeLoginModal() {
      this.isLoginModalOpen = false
    },
  },
})
