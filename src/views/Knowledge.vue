<script setup>
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import { getCategoryTree, getArticleList, editArticle, updateArticleStatus, deleteArticle } from '@/api/admin'
import DialogTable from '@/components/DialogTable.vue'
import { onMounted, ref, computed } from 'vue' 
import { Timer, Check, Delete, Edit, SortDown } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

  const tableForm = [
    { comp: 'input', prop: 'title', label: '标题', placeholder: '请输入标题' },
    { comp: 'select', prop: 'categroy', label: '分类', options:[
      {label: '心理健康基础', value: '1'},
      {label: '情绪管理', value: '2'},
    ], placeholder: '请选择分类' },
    { comp: 'select', prop: 'status', label: '状态', placeholder: '文章状态', options: [
      {label: '草稿', value: '0'},
      {label: '已发布', value: '1'},
      {label: '已下线', value: '2'},
    ] },
  ]

  // 处理查询事件
  const pagination = ref({
    currentPage: 1,
    size: 10,
    total: 0,
  })

  // 处理查询事件 + 若无查询，则直接渲染所有文章
  const articleList = ref([])
  const sortArticleList = computed(() => {
    console.log(articleList.value)
    return (articleList.value || []).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  })
  const handleSearch = async (formData) => {
    const params = {
      page: pagination.value.currentPage,
      pageSize: pagination.value.size,
      ...formData,
      
    }
    const res = await getArticleList(params)
    articleList.value = res.data.list
    pagination.value.total = res.data.pagination.total
  }

  // 获取文章分类
  const categoryMap = ref({})
  onMounted(async () => {
    const res = await getCategoryTree()
    // console.log(res)
    // 扁平化分类树，包括子分类
    const flattenCategories = (categories) => {
      let result = []
      categories.forEach(category => {
        result.push(category)
        if (category.children && category.children.length > 0) {
          result = result.concat(flattenCategories(category.children))
        }
      })
      return result
    }
    const allCategories = flattenCategories(res.data)
    tableForm[1].options = allCategories.map(item => {
      // console.log(item)
      categoryMap.value[item.id] = item.name
      // console.log(categoryMap.value)
      return {
        label: item.name,
        value: item.id
      }
    })
    // 渲染文章列表
    handleSearch()
  })

  // 处理分页事件
  const handleChange = (val) => {
    pagination.value.currentPage = val
    handleSearch()
  }

  // 处理新增/编辑文章事件
  const dialogVisible = ref(false)
  const currentArticle = ref(null)
  const handleCreate = () => {
    handleSearch()
  }
  const handleEdit = async (row) => {
    if(!row.id){
      currentArticle.value = null
      dialogVisible.value = true
      return 
    } 
    console.log(row.id)
    // 这里需要实现获取文章详情的逻辑
    const res = await editArticle(row.id)
    currentArticle.value = res.data
    console.log('currentArticle.value', currentArticle.value)
    dialogVisible.value = true
  }

  // 更新文章状态
  const handleChangeStatus = async (row) => {
    // console.log(row)
    // 发布状态转下线状态
    const name = row.status === 1 ? '下线' : '发布'
    ElMessageBox.confirm(
      `确认${name}该文章吗？`,
      'Info',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    ).then(async () => {
      console.log(row)
      const num = (name === '下线' ?  2 : 1)
        await updateArticleStatus(row.id, num)
      handleSearch()
      ElMessage.success(`已${name}该文章`)
    })
  }

  // 删除文章
  const handleDelete =  async (row) => {
      await deleteArticle(row.id)
      ElMessage.success('删除成功')
      handleSearch()
  }

</script>

<template>
    <div>
      <PageHead :title="'知识文章'">
        <template #buttons>
          <el-button type="primary" @click="handleEdit({})">新增文章</el-button>
        </template> 
      </PageHead>
      <TableSearch :tableForm="tableForm" @search="handleSearch"></TableSearch>
      <el-table :data="sortArticleList" style="width: 100%">
        <el-table-column label="标题" fixed="left" width="220">
          <template #default="scope">
            <el-icon><Timer /></el-icon>
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="分类" width="150">
          <template #default="scope">
            <el-icon><Timer /></el-icon>
            {{ categoryMap[scope.row.categoryId] || '未分类' }}
          </template>
        </el-table-column>
        <el-table-column label="作者" prop="authorName"></el-table-column>
        <el-table-column label="阅读量" prop="readCount"></el-table-column>
        <el-table-column label="发布时间" prop="updatedAt"></el-table-column>
        <el-table-column label="操作" width="200">
          <template  #default="scope" fixed="right" >
            <el-button @click="handleEdit(scope.row)" type="primary">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button @click="handleChangeStatus(scope.row)" v-if="scope.row.status == 0 || scope.row.status == 2" type="success">
              <el-icon><Check /></el-icon>
            </el-button>
            <el-button @click="handleChangeStatus(scope.row)" v-if="scope.row.status == 1" type="plain">
              <el-icon><SortDown /></el-icon>
            </el-button>
            <el-button @click="handleDelete(scope.row)" type="danger">
              <el-icon><Delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination 
      layout="prev, pager, next" 
      :total="pagination.total" 
      :page-size="pagination.size" 
      :hide-on-single-page="true"
      @change="handleChange" />
      <DialogTable v-model:modelValue="dialogVisible" :categories="tableForm[1].options" @create="handleCreate" :currentArticle="currentArticle"></DialogTable>
    </div>
</template>


<style lang="scss" scoped>

</style>