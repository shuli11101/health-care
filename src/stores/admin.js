// 后台使用
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const changeCollapse = defineStore('admin', () => {
  const isCollapse = ref(false)

  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value
  }

  return {
    isCollapse,
    toggleCollapse
  }
})