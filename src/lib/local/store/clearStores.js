import authStore from '@/lib/local/store/authStore'

export const clearStores = () => {
  authStore.remove()
}
