<script setup>
  const iconUrl = new URL('@/assets/images/like.png', import.meta.url).href
  import { ref, reactive } from 'vue'
  import dayjs from 'dayjs'
  import { ElMessage } from 'element-plus'
  import { submitEmotionDiary } from '@/api/front'

  // 情绪日志表单数据
  const diaryForm = reactive({
    diaryDate: dayjs().format('YYYY-MM-DD'),
    moodScore: null,
    dominantEmotion: '',
    emotionTriggers: '',
    diaryContent: '',
    sleepQuality: 0,
    stressLevel: 0
  })

  // 情绪状态评分
  const emotionStatus = ['绝望崩溃', '消沉抑郁', '焦虑烦躁', '低落不悦', '平静淡然', '轻松惬意', '愉悦舒心', '欢欣满足', '兴奋欣喜', '极致幸福']

  // 情绪选项
  const emotionOptions = [
    {
      name: '开心',
      url: new URL('@/assets/images/开心.png', import.meta.url).href
    },
    {
      name: '平静',
      url: new URL('@/assets/images/平静.png', import.meta.url).href
    },
    {
      name: '焦虑',
      url: new URL('@/assets/images/焦虑.png', import.meta.url).href
    },
    {
      name: '悲伤',
      url: new URL('@/assets/images/悲伤.png', import.meta.url).href
    },
    {
      name: '兴奋',
      url: new URL('@/assets/images/兴奋.png', import.meta.url).href
    },
    {
      name: '疲惫',
      url: new URL('@/assets/images/疲惫.png', import.meta.url).href
    },
    {
      name: '惊讶',
      url: new URL('@/assets/images/惊讶.png', import.meta.url).href
    },
    {
      name: '困惑',
      url: new URL('@/assets/images/困惑.png', import.meta.url).href
    },
  ]

  // 选择情绪
  const selectEmotion = (emotion) => {
    diaryForm.dominantEmotion = emotion
  }

  // 提交表单
  const submitForm = async () => {
    if(!diaryForm.moodScore) {
      ElMessage.error('请选择情绪评分')
      return
    }
    try {
      await submitEmotionDiary(diaryForm)
      ElMessage.success('情绪日记提交成功')
      resetForm()
    } catch (err) {
      ElMessage.error(err.message)
    }
    console.log('提交表单数据:', diaryForm)
  }

  // 重置表单
  const resetForm = () => {
    Object.assign(diaryForm, {
      moodScore: null,
      dominantEmotion: '',
      emotionTriggers: '',
      diaryContent: '',
      sleepQuality: null,
      stressLevel: null
    })
  }

</script>


<template>
  <div class="emotionDiary-container">
    <div class="header-section">
      <div class="header-content">
        <el-image :src="iconUrl" style="width: 60px; height: 60px;"></el-image>
        <h1>情绪日志</h1>
      </div>
    </div>
    <div class="content">
      <!-- 情绪评分 -->
      <div class="diary-card">
        <div class="title">今日情绪评分</div>
        <div class="section">
          <p>今天的整体情绪如何？</p>
          <div class="rate">
            <el-rate 
              v-model="diaryForm.moodScore"
              :show-text="true"
              :texts="emotionStatus"
              :max="10"
              size="large"
            ></el-rate>
          </div>
        </div>
      </div>
      <!-- 主要情绪 -->
      <div class="diary-card">
        <div class="title">主要情绪</div>
        <div class="emotion-grid">
          <div v-for="emotion in emotionOptions" :key="emotion.name" :class="{'selected': emotion.name === diaryForm.dominantEmotion}" @click="selectEmotion(emotion.name)" class="emotion-card">
            <el-image :src="emotion.url" style="width: 50px; height: 50px;"></el-image>
            <div class="emotion-name">{{ emotion.name }}</div>
          </div>
        </div>
      </div>
      <!-- 详细记录 -->
      <div class="diary-card">
        <div class="title">详细记录</div>
        <div class="detail-form">
          <div class="form-group">
            <div class="form-label">情绪触发因素</div>
            <el-input v-model="diaryForm.emotionTriggers" type="textarea" placeholder="今天什么事情影响到你的情绪？" :maxlength="1000" :rows="4" show-word-limit></el-input>
          </div>
        </div>
        <div class="detail-form">
          <div class="form-group">
            <div class="form-label">今日感想</div>
            <el-input v-model="diaryForm.diaryContent" type="textarea" placeholder="今天什么事情让你感想最多？" :maxlength="2000" :rows="5" show-word-limit></el-input>
          </div>
        </div>
        <!-- 生活指标 -->
         <div class="detail-form">
          <div class="life-indicators">
          <div class="indicator-group">
            <div class="form-label">睡眠质量</div>
            <el-select v-model="diaryForm.sleepQuality" placeholder="请选择睡眠质量">
              <el-option label="很好" value="5"></el-option>
              <el-option label="良好" value="4"></el-option>
              <el-option label="还行" value="3"></el-option>
              <el-option label="较差" value="2"></el-option>
              <el-option label="很差" value="1"></el-option>
            </el-select>
          </div>
          <div class="indicator-group">
            <div class="form-label">压力等级</div>
            <el-select v-model="diaryForm.stressLevel" placeholder="请选择压力等级">
              <el-option label="很好" value="5"></el-option>
              <el-option label="良好" value="4"></el-option>
              <el-option label="还行" value="3"></el-option>
              <el-option label="较差" value="2"></el-option>
              <el-option label="很差" value="1"></el-option>
            </el-select>
          </div>
         </div>
         <div class="action-buttons">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="submitForm">重置</el-button>
         </div>
         </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .emotionDiary-container {
    background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);
    .header-section {
        background: linear-gradient(135deg, #7ED321 0%, #F5A623 100%);
        color: white;
        padding: 48px;
        .header-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
    }
    .content {
        margin: 0 auto;
        width: 980px;
        padding: 20px;
        .diary-card {
            margin-bottom: 20px;
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            .title {
                margin-bottom: 20px;
                font-size: 25px;
                font-weight: 600;
                color: #374151;
            }
            .section {
                margin-bottom: 20px;
                p {
                    font-size: 15px;
                    color: #6B7280;
                    margin-bottom: 15px;
                }
            }
            .emotion-grid {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                .emotion-card {
                    padding: 15px;
                    border: 2px solid #E5E7EB;
                    border-radius: 15px;
                    text-align: center;
                    cursor: pointer;
                    background: #F9FAFB;
                    .emotion-name {
                        margin-top: 10px;
                        padding: 0 75px;
                        color: #374151;
                    }
                    &.selected {
                        border-color: #7ED321;
                        background: #F0FDF4;
                        transform: translateY(-3px);
                    }
                }
            }
            .detail-form {
                .form-label {
                    margin: 10px 0;
                    color: #374151;
                }
                .life-indicators {
                    display: flex;
                    gap: 20px;
                    .indicator-group {
                        flex: 1;
                    }
                }
                .action-buttons {
                    margin-top: 40px
                }
            }
        }
    }
}
</style>
