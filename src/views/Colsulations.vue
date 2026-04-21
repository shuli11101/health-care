<!-- 咨询记录 -->
<script setup>
  import { getConsultationDetail, getConsultationList } from '@/api/admin'
  import { onMounted, ref } from 'vue'
  import { ElPagination } from 'element-plus'

  // 咨询记录数据
  const tableForm = ref([])
  const pagination = ref({
    total: 0,
    size: 8,
    currentPage: 1
  })
  const getConsultationDetailAriticle = async () => {
    loading.value = true
    const res = await getConsultationList({
      page: pagination.value.currentPage,
      pageSize: pagination.value.size
    })
    // console.log(res.data)
    tableForm.value = res.data.list
    console.log(tableForm.value)
    pagination.value.total = res.data.pagination.total
    loading.value = false
    // console.log(pagination.value)

  }
  onMounted(() => {
    getConsultationDetailAriticle()
    console.log(tableForm.value)
  })

  // 处理分页变化
  const handleCurrentPage = (val) => {
    pagination.value.currentPage = val
    getConsultationDetailAriticle()
  }

  // 加载效果
  const loading = ref(false)
  
  // 咨询详情
  const showDetailMessage = ref(false)
  const detailData = ref({})
  const handleMessageDetail = async (row) => {
    // 先保存原始会话信息
    detailData.value = { ...row }
    showDetailMessage.value = true
    loading.value = true
    try {
      const res = await getConsultationDetail(row.id)
      console.log('咨询详情响应:', res)
      // 保存消息列表
      detailData.value.messages = res.data
    } catch (error) {
      console.error('获取咨询详情失败:', error)
      ElMessage.error('获取咨询详情失败')
    } finally {
      loading.value = false
    }
  }

</script>
  
<template>
  <div class="consultations">
    <p class="session-title">咨询记录</p>
    <el-table :data="tableForm" width="100%" v-loading="loading">
      <el-table-column label="用户ID" width="100">
        <template #default="scope">
          <el-avatar>{{ scope.row.userId }}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="主题">
        <template #default="scope">
          {{ scope.row.sessionTitle }}
        </template>
      </el-table-column>
      <el-table-column label="消息数" width="150">
        <template #default="scope">
          {{ scope.row.messageCount }}
        </template>
      </el-table-column>
      <el-table-column label="时间" width="200">
        <template #default="scope">
          {{ scope.row.startedAt }}
        </template>
      </el-table-column>
      <el-table-column label="详情" width="100">
        <template #default="scope">
          <el-button @click="handleMessageDetail(scope.row)" text type="primary">详情</el-button>
        </template>
      </el-table-column>
    
    </el-table>
    <el-dialog
      v-model="showDetailMessage"
      title="咨询详情"
      width="70%"
      :close-on-click-modal="false"
    >
      <div class="session-detail">
        <div class="detail-header">
          <div class="detail-row">
            <div class="detail-label">用户ID：</div>
            <div class="detail-value">{{ detailData.userId }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">主题:</div>
            <div class="detail-value">{{ detailData.topic }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">开始时间:</div>
            <div class="detail-value">{{ detailData.createdAt }}</div>
          </div>
        </div>
        <div class="messages-container">
          <div class="messages-header">
            <h4>对话记录</h4>
          </div>
          <div class="messages-list" v-loading="loading">
            <div class="message-item" v-for="message in detailData.messages" :key="message.id" :class="message.senderType === 1 ? 'user-message' : 'ai-message'">
              <div class="message-header">
                <span class="sender">{{ message.senderType === 1 ? '用户' : 'AI助手' }}</span>
                <span class="time">{{ message.createAt }}</span>
              </div>
              <div class="message-content">{{ message.content }}</div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button type="plain" @click="showDetailMessage = false">关闭</el-button>
      </template>
    </el-dialog>
    <el-pagination 
      layout="prev, pager, next" 
      :total="pagination.total" 
      :page-size="pagination.size"
      :current-page="pagination.currentPage"
      @current-change="handleCurrentPage"
    />
  </div>
</template>

<style lang="scss" scoped>
 .session-title {
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
  }
  .session-preview {
    font-size: 13px;
    color: #666;
    margin-bottom: 4px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .session-detail {
    max-height: 70vh;
    overflow-y: auto;
    .detail-header {
      margin-bottom: 20px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }

    .detail-row {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      :last-child {
        margin-bottom: 0;
      }
      .detail-label {
        font-weight: 500;
        color: #495057;
        min-width: 80px;
        margin-right: 8px;
      }

      .detail-value {
        color: #333;
      }
    }
  }
  .messages-container {
    margin-top: 20px;
    .messages-header {
      margin-bottom: 16px;
      h4 {
        margin: 0;
        color: #333;
        font-size: 16px;
        font-weight: 500;
      }
    }
    .messages-list {
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 16px;
      background: #fff;
      .message-item {
        margin-bottom: 12px;
        padding: 12px;
        border-radius: 8px;
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        :last-child {
          margin-bottom: 0;
        }
        &.user-message {
          background: #e8f4fd;
        }

        &.ai-message {
          background: #f0f9f0;
        }
      }
      .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        .sender {
          font-weight: 500;
          color: #333;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .time {
          font-size: 12px;
          color: #999;
        }

        .message-content {
          color: #333;
          line-height: 1.6;
          white-space: pre-wrap;
          margin-top: 8px;
          font-size: 14px;
        }
      }
    }
  }

.title {
  font-size: 24px;
  color: #2d3748;
}
</style>