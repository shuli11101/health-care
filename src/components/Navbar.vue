<script setup>
  import { ArrowDown, Expand } from '@element-plus/icons-vue'
  import { changeCollapse } from '@/stores/admin'
  import { useRouter, useRoute } from 'vue-router'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import { logoutAccount } from '@/api/admin'

  // 标题
  const route = useRoute()
  const router = useRouter()


  // 图标
  const iconMap = {
    Expand,
    ArrowDown
  }

  // 用户默认头像
  const userAvatar = new URL('../assets/images/user.jpg', import.meta.url).href

  // 处理下拉菜单点击事件
  const handleCommand = (command) => {
    console.log(command)
  }

  // 侧边栏展开折叠
  const toggleCollapse = changeCollapse().toggleCollapse

  // 退出登录
  const handleLogout = () => {
    ElMessageBox.confirm('确定退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }).then(async () => {
      await logoutAccount()
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      ElMessage.success('退出登录成功')
      router.push('/auth/login')
    })
  }


</script>



<template>
  <div class="navbar">
    <div class="flex-box">
      <el-button @click="toggleCollapse">
        <el-icon><Expand /></el-icon>
      </el-button>
      <p style="margin-left: 10px;">{{ route.meta.title }}</p>
    </div>
    <div class="flex-box">
      <!-- 整体下拉菜单位置 -->
      <el-dropdown @command="handleCommand">
        <div class="flex-box">
          <el-avatar :src="userAvatar"></el-avatar>
          <p>admin</p>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <!-- 下拉菜单（退出登陆） -->
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleLogout" command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  height: 64px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  background: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  border-bottom: 1px solid #e5e7eb;

  .flex-box {
    display: flex;
    align-items: center;
    justify-content: center;

    .el-avatar {
      margin-right: 10px;
    }
  }



  .page-title {
    margin-left: 20px;
    font-size: 26px;
    font-weight: bold;
    color: #1f2937;
  }
}
  
</style>