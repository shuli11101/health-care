<script setup>
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import { onMounted, reactive, ref } from 'vue'
import { getEmotionalList, deleteEmotional } from '@/api/admin'
import { ElMessage } from 'element-plus'

// 表单搜索框
const tableForm = reactive([
  { comp: 'input', prop: 'userId', label: '用户ID', placeholder: '请输入用户ID' },
  { comp: 'select', prop: 'emotionalStatus', label: '情绪状态', placeholder: '请选择情绪状态', options: [
    { value: '1-3', label: '较差(1-3)' },
    { value: '4-6', label: '一般(4-6)' },
    { value: '7-10', label: '较好(7-10)' }
  ]
  }
])

// 分页获取
const pagination = ref({
  total: 0,
  pageSize: 8,
  currentPage: 1
})

// 情绪列表日记获取
const emotionalList = ref([])  //情绪列表
// const emotionFactor = ref([])  //情绪触发因素

const handleSearch = async (formData) => {
  const params = {
    page: pagination.value.currentPage,
    pageSize: pagination.value.pageSize,
    ...formData,
    
  }
  const res = await getEmotionalList(params)
  console.log('resEmotion', res)

  emotionalList.value = res.data.list
  pagination.value.total = res.data.pagination.total
  console.log('emotionalList', emotionalList.value)
  // if(emotionalList.value){
    // emotionFactor.value = emotionalList.value
    // emotionalList.value.forEach(item => {
    //   item.aiEmotionAnalysis = JSON.parse(item.aiEmotionAnalysis)
    // })
  // }

  // console.log(emotionalList.value)
}

onMounted(() => {
  handleSearch()
})

// 查看日志详情
const dialogVisible = ref(false)
const currentList = ref({}) //当前详情
const currentAiEmotionalList = ref({}) //当前情绪分析结果
const handleDetail = (row) => {
  dialogVisible.value = true
  console.log(row)
  currentList.value = row
  currentAiEmotionalList.value = row.aiEmotionAnalysis
}

// 情绪tag样式映射
const getEmotionTagType = (emotion) => {
  const emotionTypes = {
    '快乐': 'success',
    '平静': 'info',
    '兴奋': 'warning',
    '愤怒': 'danger',
    '悲伤': 'info',
    '焦虑': 'warning'
  }
  return emotionTypes[emotion] || 'info'
}

const getAiEmotionTagType = (emotion) => {
  const emotionTagMap = {
    '开心': 'success',
    '平静': 'success',
    '兴奋': 'warning',
    '满足': 'success',
    '愤怒': 'danger',
    '悲伤': 'info',
    '焦虑': 'warning',
    '恐惧': 'danger',
    '沮丧': 'info',
    '压力': 'warning'
  }
  return emotionTagMap[emotion] || 'info'
}

const getEmotionScoreColor = (score) => {
  if (score >= 80) return '#f56c6c'
  if (score >= 60) return '#e6a23c'
  if (score >= 40) return '#909399'
  return '#67c23a'
}

const getRiskLevelTagType = (riskLevel) => {
  const riskTagMap = {
    0: 'success',
    1: 'info',
    2: 'warning',
    3: 'danger'
  }
  return riskTagMap[riskLevel] || 'info'
}

const getRiskLevelText = (riskLevel) => {
  const riskTextMap = {
    0: '正常',
    1: '关注',
    2: '预警',
    3: '危机'
  }
  return riskTextMap[riskLevel] || '未知风险等级'
}

// 删除情绪日志
const handleDelete = async (row) => {
  console.log(row)
  await deleteEmotional(row.id)
  ElMessage.success('删除成功')
  handleSearch()
}

</script>

<template>
  <div class="emotional">
    <PageHead title="情绪日志"></PageHead>
    <TableSearch :tableForm="tableForm" @search="handleSearch"></TableSearch>
    <el-table :data="emotionalList" style="width: 100%">
      <el-table-column prop="id" label="ID" width="100"></el-table-column>
      <el-table-column label="会话ID" width="80">
        <template #default="scope">
          <el-avatar>{{ scope.row.nickname }}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="记录日期" width="120"></el-table-column>
      <el-table-column label="情绪评分" width="300">
        <template #default="scope">
          <el-rate 
          v-model="scope.row.moodScore" 
          disabled
          :max="10"
          ></el-rate>
        </template>
      </el-table-column>
      <el-table-column label="生活指标" width="100">
        <template #default="scope">
          <div>睡眠: <span>{{ scope.row.sleepQuality }}/5</span></div>
          <div>压力: <span>{{ scope.row.stressLevel }}/5</span></div>
        </template>
      </el-table-column>
      <el-table-column prop="factor"  label="情绪触发因素"></el-table-column>
      <el-table-column prop="primaryEmotion"  label="主要心情" width="100"></el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button @click="handleDetail(scope.row)" type="primary" text>详情</el-button>
          <el-button @click="handleDelete(scope.row)" type="danger" text>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
    v-model="dialogVisible"
    title="情绪日志详情"
    width="80%"
    >
   <div class="detail-section">
    <h4>用户信息</h4>
     <el-descriptions 
    :column="2"
    border
    >
      <el-descriptions-item label="用户名">{{ currentList.username }}</el-descriptions-item>
      <el-descriptions-item label="昵称">{{ currentList.nickname }}</el-descriptions-item>
      <el-descriptions-item label="用户ID">{{ currentList.id }}</el-descriptions-item>
      <el-descriptions-item label="记录日期">{{ currentList.diaryDate }}</el-descriptions-item>      
  </el-descriptions>
   </div>
  <div class="detail-section">
    <h4>情绪状态</h4>
    <el-descriptions
  :column="2"
  border
  >
      <el-descriptions-item label="情绪评分">
        <el-rate 
        v-model="currentList.moodScore" 
        disabled
        :max="10"
        ></el-rate>
      </el-descriptions-item>
      <el-descriptions-item label="主要情绪">
        <el-tag :type="getAiEmotionTagType(currentList.dominantEmotion)">{{ currentList.dominantEmotion }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="睡眠质量">{{ currentList.sleepQuality }}/5</el-descriptions-item>
      <el-descriptions-item label="压力水平">{{ currentList.stressLevel }}/5</el-descriptions-item>

  </el-descriptions>
  </div>
  <div class="detail-section">
    <h4>日记内容</h4>
     <el-descriptions
  :column="1"
  border>
    <el-descriptions-item label="情绪触发因素">{{ currentList.emotionalTrigger || '无' }}</el-descriptions-item>
    <el-descriptions-item label="日记内容">{{ currentList.diaryContent || '无' }}</el-descriptions-item>
  </el-descriptions>
  </div>
  <div class="ai-analysis-status">
  <h4>ai情绪分析结果</h4>
   <el-descriptions
  :column="2"
  border>
    <el-descriptions-item label="主要情绪">
      <el-tag class="ai-status-tag" :type="getAiEmotionTagType(currentAiEmotionalList.primaryEmotion)">{{ currentAiEmotionalList.primaryEmotion}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="情绪强度">
      <el-progress :percentage="currentAiEmotionalList.emotionScore":color="getEmotionScoreColor(currentAiEmotionalList.emotionScore)"></el-progress>
    </el-descriptions-item>
    <el-descriptions-item label="风险等级">
      <el-tag class="ai-status-tag" :type="getRiskLevelTagType(currentAiEmotionalList.riskLevel)">{{ currentAiEmotionalList.riskLevel}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="情绪性质">
      <el-tag class="ai-status-tag" :type="getAiEmotionTagType(currentAiEmotionalList.primaryEmotion)">{{ currentAiEmotionalList.primaryEmotion}}</el-tag>
    </el-descriptions-item>
  </el-descriptions>
 </div>
 <div class="detail-section">
<div class="ai-analysis-result">
    <h5>专业建议</h5>
    <div class="suggestion-content ai-keywords-section">
      {{ currentAiEmotionalList.suggestion || '无' }}
    </div>
    <div class="ai-risk-section">
      <h5>风险描述</h5>
      <div class="risk-content">
        {{ currentAiEmotionalList.riskDescription || '无' }}
      </div>
    </div>
    <div class="ai-improvements-section">
      <h5>改善建议</h5>
      <ul class="improvement-list">
        <li v-for="item in currentAiEmotionalList.improvementSuggestions" :key="item">{{ item }}</li>
      </ul>
    </div>
  </div>
 </div>
 
  <div class="detail-section">
    <h5>时间信息</h5>
    <el-descriptions
    :column="2"
    border>
      <el-descriptions-item label="创建时间">{{ currentList.createdAt }}</el-descriptions-item>
      <el-descriptions-item label="更新时间">{{ currentList.updatedAt }}</el-descriptions-item>
    </el-descriptions>
  </div>
    </el-dialog>
  </div>
  
</template>

<style lang="scss" scoped>
.emotional {
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  
  .detail-section {
    margin-bottom: 24px;
    
    h4 {
      margin: 0 0 16px 0;
      color: #303133;
      font-size: 16px;
      
      i {
        margin-right: 8px;
        color: #409eff;
      }
    }
    
    h5 {
      margin: 0 0 12px 0;
      color: #606266;
      font-size: 14px;
      font-weight: 600;
    }
  }
}

// AI分析相关样式
.ai-analysis-status {
  .ai-status-tag {
    margin-bottom: 4px;
    
    i {
      margin-right: 4px;
    }
  }
  
  .ai-analysis-preview {
    font-size: 11px;
    color: #909399;
    margin-top: 2px;
  }
}

.ai-analysis-result {
  .ai-keywords-section,
  .ai-suggestion-section,
  .ai-risk-section,
  .ai-improvements-section {
    margin-top: 16px;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 4px;
    
    h5 {
      margin: 0 0 8px 0;
      color: #606266;
      font-size: 14px;
      font-weight: 600;
      
      i {
        margin-right: 6px;
        color: #909399;
      }
    }
  }
  
  .keywords-container {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    
    .keyword-tag {
      background-color: #e1f3d8;
      color: #67c23a;
      border-color: #b3d8a4;
    }
  }
  
  .suggestion-content,
  .risk-content {
    line-height: 1.6;
    color: #606266;
    background-color: white;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ebeef5;
  }
  
  .improvement-list {
    margin: 0;
    padding-left: 20px;
    
    li {
      margin-bottom: 4px;
      color: #606266;
      line-height: 1.5;
    }
  }
  
  .ai-analysis-meta {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #ebeef5;
    
    .analysis-time {
      margin: 0;
      font-size: 12px;
      color: #909399;
      
      i {
        margin-right: 4px;
      }
    }
  }
  
  .el-progress {
    .el-progress__text {
      font-size: 12px !important;
    }
  }
}
</style>