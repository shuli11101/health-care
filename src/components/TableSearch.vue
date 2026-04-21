<!-- 表格搜索组件 -->
<script setup>
import { ref, reactive, computed } from 'vue';
import { getArticleList } from '../api/admin';

  // 接收父级传过来的el-input类型
  const props = defineProps({
    tableForm: {
      type: Array,
      default: () => []
    }
  })

  const emit = defineEmits(['search'])

  // 判断组件类型
  const isComp = (comp) => {
    return {
      input: 'el-input',
      select: 'el-select'
    }[comp]
  }

  // 储存数据
  const formData = reactive({})

  // 处理查询事件
  const handleSearch = async () => {

    emit('search', formData)
  }
  // 处理重置事件
  const ruleFormRef = ref()
  const handleReset = (Elform) => {
    // 有时表单内可能有默认值，重置不一定是清空
    if(!Elform) return
    Elform.resetFields()
    emit('search', formData)
  }

  // 表单布局
  const tableFormAttrs = computed(() => {
    const { tableForm } = props
    tableForm.forEach(item => {
       item.col = {
        xs: 24,
        sm: 12,
        md: 8,
        lg: 6,
        xl: 6
      }
    })
    return tableForm
  })
</script>

<template>
  <el-form :model="formData" ref="ruleFormRef">
    <el-row :gutter="24">
      <el-col v-for="item in tableFormAttrs" :key="item.prop" v-bind="item.col">
        <el-form-item :label="item.label" :prop="item.prop">
          <component v-model="formData[item.prop]" :is="isComp(item.comp)" :placeholder="item.placeholder">
            <template v-if="item.comp === 'select'">
              <el-option 
                v-for="it in item.options" 
                :key="it.value" 
                :label="it.label" 
                :value="it.value">
              </el-option> 
            </template>
          </component>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="24" style="display: flex; justify-content: flex-start; gap: 10px;">
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset(ruleFormRef)">重置</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>


<style scoped lang="scss">

</style>