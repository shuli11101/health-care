<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

  // 首页图片
  const logo = new URL('@/assets/images/robot-fill.png', import.meta.url).href
</script>


<template>
  <div class="home-container">
    <div class="content">
      <div class="text">
        <h2 class="title">
          一次温暖的对话<br/>
          <span class="highlight-text">化孤独的慰籍</span>
        </h2>
        <p class="description">每个深夜，每个焦虑的时刻，我们在这里。不必肚子承受，让心与心的连接温暖您的每一天</p>
        <div class="hero-actions">
          <el-button @click="router.push('/frontConsulations')" size="large" type="info" style="background-color: #6B7280;" round>开始倾诉，获得陪伴</el-button>
          <el-button @click="router.push('/frontEmotional')" size="large" style="border-color: #A8A4CE ; background-color: transparent; color: #A8A4CE " round>记录心情，释放情感</el-button>
        </div>
      </div>
      <div class="robot">
        <el-image :src="logo"></el-image>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

// 背景颜色渐变
@keyframes gradientBG {
  0% { background-position: 0% 50%;}
  50% { background-position: 100% 50%;}
  100% { background-position: 0% 50%;}
}


.home-container {
    background: linear-gradient(-45deg,  #ff9a9e, #fad0c4, #fff1eb, #ffe0fd);
    animation: gradientBG 10s ease infinite;
    color: #6E5A49;
    padding: 5rem 0;
    height: calc(100vh - 285px);
    display: flex;
    align-items: center;
    justify-content: center;
    .content {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 30px;
        .text {
            width: 500px;
            .title {
                font-size: 45px;
                font-weight: bold;
                // line-height: 1.2;
                margin-bottom: 15px;
                .highlight-text {
                    color: #374151;
                }
                .description {
                  color: #4B3F72;
                  font-weight: 400;
                }
            }
            .hero-actions {
                margin-top: 30px;
            }
        }
        .robot {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 260px;
            height: 260px;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.2);
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1),inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
    }
}




</style>
