<script setup>
import { onMounted, ref } from 'vue';
import { getArticleList } from '@/api/front';
import dayjs from 'dayjs';
import { Avatar, List, Platform } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { Histogram } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

  const routerKey = useRouter()

  const book = new URL('@/assets/images/book.png', import.meta.url).href
  const recommendList = ref([])

  // 获取菜单列表
  onMounted(async () => {
    const params = {
      sortField: 'readCound',
      sortDirection: 'desc',
      currentPage: 1,
      size: 5
    }
    try {
      const res = await getArticleList(params)
      console.log(res)
      recommendList.value = res.data.list

    } catch(err) {
      ElMessage.error('获取菜单列表失败')
      console.log('获取菜单列表失败', err)
    }

    getPageList()
  })

  // 右侧列表
  // 分页
  const pagination = ref({
    currentPage: 1,
    size: 10,
    total: 0
  })

  // 获取列表数据
  const articleList = ref([])
  const getPageList = async () => {
    const params = {
      sortField: 'published',
      sortDirection: 'desc',
      ...pagination.value
    }
    try {
      const res = await getArticleList(params)
      console.log('列表数据',res)
      articleList.value = res.data.list
      pagination.value.total = res.data.total
    } catch(err) {
      ElMessage.error('获取列表数据失败')
      console.log('获取列表数据失败', err)
    }
  }


  // 获取图片
  const getImage = (url) => {
    return 'http://localhost:3000' + url || 'https://file.itndedu.com/psychology_ai.png'
  }

  // 分页
  const handleCurrentPage = (val) => {
    pagination.value.currentPage = val
    getPageList()
  }

  // 点击获取详情页
  const getArticleDetail = (id) => {
    routerKey.push(`/frontArticleDetail/${id}`)
  }

</script>


<template>
  <div class="knowledge-container">
    <div class="header-section">
      <div class="header-content">
        <el-image :src="book" style="width: 60px; height: 60px;" />
        <h1>知识库</h1>
      </div>
    </div>
    <div class="content">
        <!-- 左侧菜单 -->
         <div class="recommend-section">
          <div class="section-title">推荐</div>
          <div class="recommend-list">
            <div v-for="item in recommendList" :key="item.id" class="recommend-item" @click="getArticleDetail(item.id)">
              <h4>{{ item.title }}</h4>
              <p class="read-count">
                <el-icon><Histogram /></el-icon>
                <span>阅读量：{{ item.readCount }}</span>
              </p>
            </div>
          </div>
         </div>
         <!-- 右侧 -->
         <div class="article-list">
          <div v-for="item in articleList" :key="item.id" class="article-item" @click="getArticleDetail(item.id)">
            <el-image style="width: 240px; height: 150px;" :src=getImage(item.coverImage)></el-image>
            <div class="info">
              <div class="title">
                <h3>{{ item.title }}</h3>
                <el-tag type="primary" plain>{{  item.categoryName }}</el-tag>
              </div>
              <div style="margin-top: 10px">
                <div class="flex-box">
                  <el-icon><Avatar /></el-icon>
                  <span>{{ item.authorName }}</span>
                </div>
                <div class="flex-box">
                  <el-icon><List /></el-icon>
                  <span>{{ dayjs(item.updatedAt).format('YYYY-MM-DD') }}</span>
                </div>
              </div>
              <div style="margin-top: 10px">
                <div class="flex-box">
                  <el-icon><Platform /></el-icon>
                  <span>观看人数：{{ item.readCount }}</span>
                </div>
              </div>
            </div>
          </div>
         </div>
    </div>
    <!-- 分页 -->
    <div class="pagination-wrapper">
      <el-pagination 
        layout="prev, pager, next" 
        :total="pagination.total" 
        :page-size="pagination.size"
        :current-page="pagination.currentPage"
        @current-change="handleCurrentPage"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-container {
    background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);
    .flex-box {
        display: flex;
        align-items: center;
        span {
            margin-left: 10px;
        }
    }
    .header-section {
        background: linear-gradient(135deg, #f59e0b 0%, #8b5cf6 100%);
        color: white;
        padding: 48px;
        .header-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
    }
    .content {
        display: flex;
        gap: 20px;
        margin: 0 auto;
        width: 1200px;
        padding: 20px;
        .recommend-section {
            width: 280px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
            padding: 15px;
            height: 400px;
            position: sticky;
            top: 10px;
            .section-title {
                font-size: 12;
                font-weight: 600;
                color: #374151;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            .recommend-list {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                .recommend-item {
                    border-left: 4px solid #f59e0b;
                    padding-left: 10px;
                    cursor: pointer;
                    .read-count {
                        margin-top: 15px;
                        font-size: 12px;
                        color: #6b7280;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                }
            }
        }
        .article-list {
            flex: 1;
            .article-item {
                background: white;
                border-radius: 12px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
                padding: 15px;
                margin-bottom: 20px;
                display: flex;
                .info {
                    margin-left: 20px;
                    .title {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                }
            }
        }
    }
    .pagination-wrapper {
        display: flex;
        justify-content: center;
        padding-bottom: 30px;
    }
}

</style>