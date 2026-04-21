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
  const currentRoute = router.options.routes[0]
  router.push(`${currentRoute.path}/${index}`)
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
      >
      <div  class="brand">
      <el-image class="brand-logo" style="width: 50px; height: 50px; margin-right: 10px;" :src="brandImg"></el-image>
          <div v-show="!isCollapse" class="info-card">
            <h1 class="brand-title">心理健康AI助手</h1>
            <p class="brand-subtitle">管理后台</p>
          </div>
        </div>
          <el-menu-item v-for="item in router.options.routes[0].children" :key="item.path" :index="item.path" @click="selectMenu(item.path)">
            <el-icon>
              <component :is="iconMap[item.meta.icon]" />
            </el-icon>
            <span class="menu-title">{{ item.meta.title }}</span>
          </el-menu-item>
      </el-menu>

  </el-row>
</template>

<style lang="scss" scoped>
  .menu-style {
    height: 100%;
    .el-menu-item {
      overflow: hidden;
      white-space: nowrap;
    }
  }

    .menu-style {
      /* 图标默认状态 */
      :deep(.el-menu-item .el-icon) {
        transition: transform .25s ease, margin .25s ease;
        transform: translateY(0);
      }

      /* 折叠过程中：图标缓慢上移 */
      :deep(.el-menu--collapse .el-menu-item .el-icon) {
        transform: translateY(-3px); // 你可改成 -2~-5px
      }

      /* 展开：延迟一点出现，避免“蹦出来” */
      :deep(.el-menu:not(.el-menu--collapse)) .menu-title {
        transition-delay: .08s;
      }

  }
  .brand {
    display: flex;
    align-items: center;
    padding: 20px;
    background-color: #f5f7fa;

     /* 新增：整体过渡 */
    opacity: 1;
    transform: translateX(0);
    transition: opacity .2s ease, transform .2s ease, padding .2s ease;

    .brand-logo {
    width: 50px;
    height: 50px;
    margin-right: 10px;
    flex-shrink: 0;
    transition: opacity .18s ease, transform .18s ease, margin .18s ease;
  }

  /* 折叠时调整padding和其他样式 */
  .el-menu--collapse & {
    justify-content: center;
  }

  /* 折叠时顶部区域淡出，不是瞬间没 */

    
    .info-card {
      .brand-title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 5px;
        color: #1f2937;
        overflow: hidden;
        white-space: nowrap;
      }

      .brand-subtitle {
        font-size: 14px;
        font-weight: normal;
      }
    }
  }



</style>

