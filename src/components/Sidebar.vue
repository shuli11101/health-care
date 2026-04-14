<script setup>
  import { useRouter } from 'vue-router'
  import { PieChart, Document, ChatLineRound, User } from '@element-plus/icons-vue'
  import { changeCollapse } from '@/stores/admin'
  import { computed } from 'vue'

  const router = useRouter()

  // 左上角图片显示
  const brandImg = new URL('../assets/images/机器人.png', import.meta.url).href
  

  // 图标
  const iconMap = {
    PieChart,
    Knowledge: Document,
    ChatLineRound,
    User
  }

// 选择菜单
const selectMenu = (index) => {
  const currentRoute = router.options.routes[1]
  router.push(`${currentRoute.path}/${index.index}`)
}

// 侧边栏展开折叠
const chCollapse = changeCollapse()
const isCollapse = computed(() => chCollapse.isCollapse)

</script>



<template>
  <el-row width="264px" class="tac">
      <el-menu
        default-active="1"
        class="menu-style"
        :collapse="isCollapse"
        :collapse-transition="false"
      >
        <div class="brand">
          <el-image style="width: 50px; height: 50px; margin-right: 10px;" :src="brandImg"></el-image>
          <div class="info-card" v-show="!isCollapse">
            <h1 class="brand-title">心理健康AI助手</h1>
            <p class="brand-subtitle">管理后台</p>
          </div>
        </div>
          <el-menu-item v-for="item in router.options.routes[1].children" :key="item.path" :index="item.path" @click="selectMenu">
            <el-icon>
              <component :is="iconMap[item.meta.icon]" />
            </el-icon>
            <span>{{ item.meta.title }}</span>
          </el-menu-item>
      </el-menu>

  </el-row>
</template>

<style lang="scss" scoped>
  .menu-style {
    height: 100%;
  }
  .brand {
    display: flex;
    align-items: center;
    padding: 20px;
    background-color: #f5f7fa;
    
    .info-card {
      .brand-title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 5px;
        color: #1f2937;
      }

      .brand-subtitle {
        font-size: 14px;
        font-weight: normal;
      }
    }
  }
</style>

