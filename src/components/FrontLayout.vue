<script setup>
import { onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { logoutAccount } from '@/api/admin';


// logo
const logo = new URL('@/assets/images/机器人.png', import.meta.url).href

// 确定是否登陆
const isLogin = ref(false)
onMounted(() => {
  isLogin.value = localStorage.getItem('token')
})

// 退出登陆
const router = useRouter()
const handleLogout = () => {
  ElMessageBox.confirm('确定退出登陆吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await logoutAccount()
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    ElMessage.success('退出登陆成功')
    isLogin.value = false
    router.push('/auth/login')
  })
}

</script>

<template>
  <div class="frontend-layout">
    <div class="navbar-container">
      <div class="brand-section">
        <el-image :src="logo" style="width: 50px; height: 50px;"></el-image>
        <h1 class="brand-name">心理健康AI助手</h1>
      </div>
      <div class="nav-section">
        <router-link class="nav-link" to="/">首页</router-link>
        <router-link class="nav-link" v-if="isLogin" to="/frontConsulations">AI咨询</router-link>
        <router-link class="nav-link" v-if="isLogin" to="/frontEmotional">情感日记</router-link>
        <router-link class="nav-link" to="/frontKnowledge">知识库</router-link>
        <template v-if="isLogin">
          <el-button @click.stop="handleLogout" class="logout-btn">退出登陆</el-button>
        </template>
        <template v-else>
          <router-link class="nav-link" to="/auth/login">登陆</router-link>
          <router-link class="nav-link" to="/auth/register">
            <el-button >注册</el-button>
          </router-link>
        </template>
      </div>
    </div>
    <div class="main-content">
      <router-view></router-view>
    </div>
    <div class="footer-container">
      <div class="footer-bottom">
        <p>&copy; 心理健康助手. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.frontend-layout {
        background-color: #fff;
        .navbar-container {
            max-width: 1200px;
            height: 100%;
            margin: 0 auto;
            padding: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .brand-section {
                display: flex;
                align-items: center;
                .brand-name {
                    margin-left: 10px;
                    font-size: 24px;
                    font-weight: 600;
                    color: #333;
                }
            }
            .nav-section {
                display: flex;
                align-items: center;
                gap: 40px;
                .nav-link {
                    color: #4b5563;
                    font-size: 16px;
                    font-weight: 500;
                    &:hover {
                        color: #4A90E2;
                    }
                }

            }
        }

        .footer-container {
            background: #1f2937;
            color: white;
            padding: 15px 0;
            margin-top: auto;
            .footer-bottom {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 10px;
                text-align: center;
            }
        }
    }
</style>