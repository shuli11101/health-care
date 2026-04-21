<script setup>
import { getAnalysisData } from '@/api/admin'
import { ref, onMounted, computed } from 'vue'
import echarts from '@/utils/echarts.js'



// 综合数据分析获取
const totalData = ref({})
const getTotalData = async () => {
  const res = await getAnalysisData()
  totalData.value = res.data
  console.log('res', totalData.value)
  initChart()
}

onMounted(() => {
  getTotalData()
})

// 图片
const icon1 = new URL('../assets/images/users.png', import.meta.url).href
const icon2 = new URL('../assets/images/like.png', import.meta.url).href
const icon3 = new URL('../assets/images/comments.png', import.meta.url).href
const icon4 = new URL('../assets/images/smile.png', import.meta.url).href

// 情绪趋势图表
const emotionChart = ref(null)
const emotionChartRef = ref(null)
const trendData = computed(() => totalData.value.emotionTrend || [])
// 咨询趋势图表
const consultationChart = ref(null)
const consultationChartRef = ref(null)
const consultationTrendData = computed(() => totalData.value.consultationStats.dailyTrend || [])
// 用户活跃度图表
const userActiveChart = ref(null)
const userActiveChartRef = ref(null)
const userActiveTrendData = computed(() => totalData.value.userActivity || [])


// 初始化图表
const initChart = () => {
  initEmotionChart()
  initConsultationChart()
  initUserActiveChart()
}

const initEmotionChart = () => {
  if(!emotionChartRef.value) { //如果图表容器不存在
    return
  }
  
  // 销毁已存在的图表
  if(emotionChart.value) {
    emotionChart.value.dispose()
  }
  
  // 初始化图表
  emotionChart.value = echarts.init(emotionChartRef.value)

  // 配置
  const option = {
    title: {
      text: '情绪趋势分析',
      textStyle: {
        fontSize: 16,
        color: '#2d3436'
        },
        left: 'center',
        top: 0
    },
    tooltip: {
      trigger: 'axis',
      borderColor: '#fab1a0',
      borderWidth: 1,
      textStyle: {
        color: '#2d3436'
      }
    },
    legend: {
      data: ['平均情绪评分', '记录数量'],
      top: 20,
    },
    grid: {
      top: 60,
      left: '3%',
      right: '4%',
      bottom: '3%',
    },
    xAxis: {
      type: 'category',
      data: trendData.value.map(item => item.date),
      axisLabel: {
        lineStyle: {
          color: '#2d3436',
        }
      }
      },
      yAxis: [
      {
        type: 'value',
        name: '情绪评分',
        position: 'left',
        axisLabel: {
          lineStyle: {
            color: '#2d3436',
          }
        }
      },
      {
        type: 'value',
        name: '记录数量',
        position: 'right',
        axisLabel: {
          lineStyle: {
            color: '#2d3436',
          }
        }
      }
    ],
    series:[{
      name: '平均情绪评分',
      type: 'line',
      data: trendData.value.map(item => item.avgMoodScore) || [],
      lineStyle: {
        color: '#f8fb41',
        width: 3,
      },
      smooth: true,
      itemStyle: {
        color: '#f8fb41'
      }
    },
    {
      name: '记录数量',
      type: 'line',
      data: trendData.value.map(item => item.recordCount) || [],
      lineStyle: {
        color: '#eeb5b3',
        width: 3,
      },
      smooth: true,
      itemStyle: {
        color: '#eeb5b3'
      }
    }]
    }
  emotionChart.value.setOption(option)
}

const initConsultationChart = () => {
  if(!consultationChartRef.value) { //如果图表容器不存在
    return
  }

  // 销毁已存在的图表
  if(consultationChart.value) {
    consultationChart.value.dispose()
  }
  
  // 初始化图表
  consultationChart.value = echarts.init(consultationChartRef.value)

  // 配置
  const option = {
  title: {
    text: '咨询活动统计',
    textStyle: {
      fontSize: 16,
      fontWeight: 600,
      color: '#2d3436'
    },
    left: 'center',
    top: 10
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#fab1a0',
    borderWidth: 1,
    textStyle: {
      color: '#2d3436'
    }
  },
  legend: {
    data: ['会话数量', '参与用户数'],
    top: 40,
    textStyle: {
      color: '#636e72'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: 80,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: consultationTrendData.value.map(item => item.date),
    axisLine: {
      lineStyle: {
        color: 'rgba(244, 162, 97, 0.3)'
      }
    },
    axisLabel: {
      color: '#636e72'
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      color: '#636e72'
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(244, 162, 97, 0.3)'
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(244, 162, 97, 0.1)'
      }
    }
  },
  series: [
    {
      name: '会话数量',
      type: 'bar',
      data: consultationTrendData.value.map(item => item.sessionCount),
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#74b9ff' },
            { offset: 1, color: '#0984e3' }
          ]
        }
      },
      barWidth: '40%'
    },
    {
      name: '参与用户数',
      type: 'bar',
      data: consultationTrendData.value.map(item => item.userCount),
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#fdcb6e' },
            { offset: 1, color: '#f39c12' }
          ]
        }
      },
      barWidth: '40%'
    }
  ]
}
  consultationChart.value.setOption(option)
}

const initUserActiveChart = () => {
  if(!userActiveChartRef.value) { //如果图表容器不存在
    return
  }

  // 销毁已存在的图表
  if(userActiveChart.value) {
    userActiveChart.value.dispose()
  }
  
  // 初始化图表
  userActiveChart.value = echarts.init(userActiveChartRef.value)
  
  // 配置
  const option = {
  title: {
    text: '用户活跃度趋势',
    textStyle: {
      fontSize: 16,
      fontWeight: 600,
      color: '#2d3436'
    },
    left: 'center',
    top: 10
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#fab1a0',
    borderWidth: 1,
    textStyle: {
      color: '#2d3436'
    }
  },
  legend: {
      selected: {
        '活跃用户': true,
        '新增用户': true,
        '日记用户': false,
        '咨询用户': false
      },
    top: 40,
    textStyle: {
      color: '#636e72'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: 80,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: userActiveTrendData.value.map(item => item.date),
    axisLine: {
      lineStyle: {
        color: 'rgba(244, 162, 97, 0.3)'
      }
    },
    axisLabel: {
      color: '#636e72'
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      color: '#636e72'
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(244, 162, 97, 0.3)'
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(244, 162, 97, 0.1)'
      }
    }
  },
  series: [
    {
      name: '活跃用户',
      type: 'line',
      data: userActiveTrendData.value.map(item => item.activeUsers),
      smooth: 0.25,
      lineStyle: {
        width: 3,
        color: '#a29bfe'
      },
      itemStyle: {
        color: '#a29bfe'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(162, 155, 254, 0.4)' },
            { offset: 1, color: 'rgba(162, 155, 254, 0.1)' }
          ]
        }
      }
    },
    {
      name: '新增用户',
      type: 'line',
      data: userActiveTrendData.value.map(item => item.newUsers), 
      smooth: 0.25,
      lineStyle: {
        width: 3,
        color: '#fdcb6e'
      },
      itemStyle: {
        color: '#fdcb6e'
      }
    },
    {
      name: '日记用户',
      type: 'line',
      data: userActiveTrendData.value.map(item => item.diaryUsers),
      smooth: 0.25,
      lineStyle: {
        width: 3,
        color: '#00b894'
      },
      itemStyle: {
        color: '#00b894'
      }
    },
    {
      name: '咨询用户',
      type: 'line',
      data: userActiveTrendData.value.map(item => item.consultationUsers),
      smooth: 0.25,
      lineStyle: {
        width: 3,
        color: '#fab1a0'
      },
      itemStyle: {
        color: '#fab1a0'
      }
    }
  ]
}
  userActiveChart.value.setOption(option)
}
  


</script>


<template>
  <div class="dashboard-container">
    <el-row :gutter="24">
      <el-col :span="6">
        <el-card>
          <div class="card-content">
            <div class="avatar users">
              <el-image :src="icon1" style="width: 40px; height: 40px"></el-image>
            </div>
            <div class="info">
              <p class="title">总用户数</p>
              <p class="number">{{ totalData?.systemOverview?.totalUsers || 0 }}</p>
              <p class="subtitle-title">活跃用户：{{ totalData?.systemOverview?.activeUsers || 0 }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-content">
            <div class="avatar like">
              <el-image :src="icon2" style="width: 40px; height: 40px"></el-image>
            </div>
            <div class="info">
              <p class="title">情绪日志</p>
              <p class="number">{{ totalData?.systemOverview?.totalDiaries || 0 }}</p>
              <p class="subtitle-title">今日新增：{{ totalData?.systemOverview?.todayNewDiaries || 0 }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-content">
            <div class="avatar comments">
              <el-image :src="icon3" style="width: 40px; height: 40px"></el-image>
            </div>
            <div class="info">
              <p class="title">咨询会话</p>
              <p class="number">{{ totalData?.systemOverview?.totalSessions || 0 }}</p>
              <p class="subtitle-title">今日新增：{{ totalData?.systemOverview?.todayNewSessions || 0 }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-content">
            <div class="avatar smile">
              <el-image :src="icon4" style="width: 40px; height: 40px"></el-image>
            </div>
            <div class="info">
              <p class="title">平均情绪</p>
              <p class="number">{{ totalData?.systemOverview?.avgMoodScore || 0 }}/10</p>
              <p class="subtitle-title">情绪健康指数</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px;" :gutter="24">
      <el-col :span="12">
        <el-card style="width: 100%;">
          <template #header>
            <div class="card-header">
              情绪趋势分析
            </div>
          </template>
          <div class="chart-content">
            <div ref="emotionChartRef" style="width: 100%; height: 360px;">
            </div>
          </div>
        </el-card>
      </el-col> 
      <el-col :span="12">
        <el-card style="width: 100%;">
          <template #header>
            <div class="card-header">
              咨询会话统计
            </div>
          </template>
          <div class="chart-content">
            <div class="consultation-stats">
              <div class="stat-item">
                <div class="stat-label">总会话数</div>
                <div class="stat-value">{{ totalData.consultationStats?.totalSessions || 0 }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">平均时长</div>
                <div class="stat-value">{{ totalData.consultationStats?.avgDurationMinutes || 0 }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">活跃用户</div>
                <div class="stat-value">{{ totalData.systemOverview?.activeUsers || 0 }}</div>
              </div>
            </div>
            <div ref="consultationChartRef" style="width: 100%; height: 294px;"></div>
          </div>
        </el-card>
      </el-col> 
    </el-row>
    <el-row style="margin-top: 20px;">
      <el-col :span="24">
        <el-card style="width: 100%;">
          <template #header>
            <div class="card-header">
              用户活跃度分析
            </div>
          </template>
          <div class="chart-content">
            <div ref="userActiveChartRef" style="width: 100%; height: 360px;">
            </div>
          </div>
        </el-card>
      </el-col> 
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
    .card-content {
      display: flex;
      align-items: center;
      .avatar {
        margin-right: 12px;
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        &.users {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        &.like {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        &.comments {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        &.smile {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }
      }
      .info {
        .title {
          font-size: 14px;
          color: #7f8c8d;
          margin-bottom: 4px;
        }
        .value {
          font-size: 24px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 4px
        }
        .subtitle-title {
          font-size: 12px;
          color: #95a5a6;
        }
      }
    }
    .chart-content {
      padding: 20px;
      position: relative;

      canvas {
        width: 100% !important;
        height: 100% !important;
      }

      .consultation-stats {
        display: flex;
        justify-content: space-around;
        margin-bottom: 20px;

        .stat-item {
          text-align: center;

          .stat-label {
            font-size: 12px;
            color: #7f8c8d;
            margin-bottom: 4px;
          }

          .stat-value {
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
          }
        }
      }
    }
  }
</style>