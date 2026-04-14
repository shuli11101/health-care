<script setup>
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'

  const tableForm = [
    { comp: 'input', prop: 'title', label: '标题', placeholder: '请输入标题' },
    { comp: 'select', prop: 'categroy', label: '分类', options:[
      {label: '心理健康基础', value: '1'},
      {label: '情绪管理', value: '2'},
    ], placeholder: '请选择分类' }
  ]

  // 处理查询事件
  const handleSearch = (formData) => {
    console.log('查询事件', formData)
  }
</script>

<template>
    <div>
      <PageHead :title="'知识文章'">
        <template #buttons>
          <el-button type="primary">新增文章</el-button>
        </template> 
      </PageHead>
      <TableSearch :tableForm="tableForm" @search="handleSearch"></TableSearch>
      
    </div>
</template>


<style lang="scss" scoped>

</style>