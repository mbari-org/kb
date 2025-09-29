import authStore from '@/lib/store/authStore'

export const clearStores = () => {
  authStore.remove()
}
