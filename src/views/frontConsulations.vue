<script setup>
import { DeleteFilled, Plus, Promotion, ChatRound, Clock } from '@element-plus/icons-vue'
import { nextTick, onMounted, ref, watch } from 'vue'
import { createNewChat, getChatList, getChatDetail, analyzeEmotion } from '@/api/front'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import { ElMessage } from 'element-plus'
import { deleteChat } from '@/api/front'
import { fetchEventSource } from '@microsoft/fetch-event-source'

// 图片
const iconUrl1 = new URL('@/assets/images/robot-fill.png', import.meta.url).href;
const iconUrl2 = new URL('@/assets/images/like.png', import.meta.url).href;
const userIcon = new URL('@/assets/images/users.png', import.meta.url).href;

// 新建会话
const message = ref([])
const userInput = ref('')
const aiIsTyping = ref(false)
const isTyping = ref(false)

// 页面跟着当前对话
const chatBodyRef = ref(null)

// 临时会话创建
const handleNewChat = () => {
  if(aiIsTyping.value) {
    ElMessage.error('请稍后再创建新会话')
    return
  }
  console.log('临时会话')
  const newChat = {
    sessionId: `temp_${Date.now()}`,
    status: 'TEMP',
    sessionTitle: '新对话'
  }
  currentChat.value = newChat
  // 重置状态
  aiIsTyping.value = false
  isTyping.value = false
  message.value = []
}

// 定义当前会话对象
const currentChat = ref(null)
const historyBodyRef = ref(null)

onMounted(() => {
  // 初始化会话
  handleNewChat()
  getChatPage()
  
  // 监听消息变化，自动滚动到底部
  watch(message, async () => {
    await nextTick()
    const el = chatBodyRef.value
    const historyEl = historyBodyRef.value
    if(el) {
      el.scrollTop = el.scrollHeight
    }

  }, { deep: true })

  watch(chatList, async () => {
    await nextTick()
    const el = historyBodyRef.value
    if(el) {
      el.scrollTop = el.scrollHeight
    }
  }, { deep: true })

})

// 发送消息
const handleSendMessage = async () => {
  const content = userInput.value.trim()
  if (content === '') {
    return
  }
  if(aiIsTyping.value) {
    ElMessage.error('请稍后再发送消息')
    return
  }

  // 添加用户消息到聊天记录
  const userMessage = {
    id: Date.now(),
    senderType: 1,
    content: content,
    createAt: new Date().toLocaleTimeString()
  }
  message.value.push(userMessage)
  
  // 清空输入框
  userInput.value = ''

  // 分析用户情绪
  try {
    const emotionRes = await analyzeEmotion(content)
    if (emotionRes.code === 200) {
      currentEmotion.value = emotionRes.data
    }
  } catch (error) {
    console.error('情绪分析失败:', error)
  }

  // 判断是新会话和临时会话，创建新会话
  if(currentChat.value.status === 'TEMP') {
    startNewChat(content)
  } else {
    // 非临时会话，直接调用AI响应
    startAIResponse(currentChat.value.sessionId, content)
  }
}

const startNewChat = async (content) => {
  const chatParams = {
    initialMessage: content,
    topic: currentChat.value.status === 'TEMP' ? `AI助手 - ${new Date().toLocaleString()}` : currentChat.value.sessionTitle
  }
  try {
    const res = await createNewChat(chatParams)
    console.log(res)
    // 解析会话数据
    const sessionData = {
      sessionId: res.data.id,
      status: res.data.status,
      sessionTitle: chatParams.sessionTitle
    }
    
    // 如果当前是临时会话，更新数据
    if( currentChat.value && currentChat.value.status === 'TEMP') {
      Object.assign(currentChat.value, sessionData)
    } else {
      currentChat.value = sessionData
    }
    
    // 更新历史会话列表
    getChatPage()

    // 开启流式对话
    startAIResponse(res.data.id, content)
  } catch (error) {
    console.log(error)
    // 恢复输入框状态
    aiIsTyping.value = false
    isTyping.value = false
    ElMessage.error('创建会话失败，请重试')
  }
}

// 流式对话
const startAIResponse = (sessionId, userMessage) => {
  // 防止重复发送
  if(isTyping.value || aiIsTyping.value) {
    ElMessage.error('请稍后再发送消息')
    return
  }
  isTyping.value = true
  aiIsTyping.value = true

  try {
    // 创建AI消息
    const  aiMessage = {
      id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      senderType: 2,
      content: '',
      createAt: new Date().toISOString()
    }

    message.value.push(aiMessage)

    // 调用流式接口
    const ctrl = new AbortController() //用于终止fetch请求
    console.log('开始调用流式接口:', sessionId, userMessage)
    fetchEventSource('http://localhost:3000/api/ai.stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      accept: 'text/event-stream'
    },
    body: JSON.stringify({
      sessionId,
      userMessage
    }),
    // 停止请求
    signal: ctrl.signal,
    onopen: (response) => {
      if(response.headers.get('content-type') !== 'text/event-stream') {
        handleError('服务器返回非流式数据')
      }
    },
    onmessage: (event) => {
      const raw = event.data.trim()
      if(!raw) return
      const eventName = event.event
      // 当前会话AI消息
      const aiMessage = message.value[message.value.length - 1]

      if(eventName === 'done') {
        console.log('消息接收完成')
        isTyping.value = false
        aiIsTyping.value = false
        ctrl.abort()
        return
      }
      const payload = JSON.parse(raw)
      console.log('解析消息:', payload)
      const ok = String(payload.code) == '200'
      if( ok && payload.data && payload.data.content) {
        aiMessage.content += payload.data.content
        console.log('AI回复:', aiMessage.content)
      } else if(!ok) {
        handleError(payload.msg || 'AI回复失败')
      }

    },
    // 错误处理
    onError: (error) => {
      handleError(error.message)
      return error
    },
    // 关闭处理
    onClose: () => {
      // 开始情绪分析
    }


  })
  } catch (error) {
    console.error('流式接口调用失败:', error)
    handleError(error.message)
  }


}

// 处理错误函数
const handleError = (error) => {
  const aiMessage = message.value[message.value.length - 1]
  if(aiMessage) {
    aiMessage.content = 'AI回复失败，请重试'
  }
  isTyping.value = false
  aiIsTyping.value = false
  ElMessage.error('AI回复失败，请重试')
}

// 定义历史会话列表
const chatList = ref([])
const getChatPage = async () => {
  try {
    const res = await getChatList({
      pageNum: 1,
      pageSize: 10
    })
    console.log(res.data)
    // 解析会话数据 
    chatList.value = res.data.list

    // 监听消息变化，自动滚动到底部
  } catch (error) {
    console.log(error)
  }
}

// 点击获取会话数据（从历史数据中）
const handleChatClick = async (item) => {
  if(aiIsTyping.value) {
    ElMessage.error('请稍后再点击消息')
    return
  }
  console.log(item)
  try {
    const res = await getChatDetail(item.id)
    console.log(res)
    // 解析会话数据 
    message.value = res.data
    // 更新当前会话
    const chatData = {
      sessionId: item.id,
      status: 'ACTIVE',
      sessionTitle: item.sessionTitle
    }
    currentChat.value = chatData

  } catch (error) {
    console.log(error)
  }
}

// 删除会话记录
const isDeleting = ref(false)
const handleDeleteChat = async (item) => {
  console.log('删除会话:', item)
  if (isDeleting.value) {
    return
  }
  
  try {
    isDeleting.value = true
    const res = await deleteChat(item.id)
    if (res.code === 200) {
      ElMessage.success('删除会话成功')
      // 更新历史会话列表
      await getChatPage()
      
      // 如果删除的是当前会话，切换到其他会话或创建新会话
      if (currentChat.value && currentChat.value.sessionId === item.id) {
        if (chatList.value.length > 0) {
          // 切换到第一个会话
          handleChatClick(chatList.value[0])
        } else {
          // 创建新会话
          handleNewChat()
        }
      }
    } else {
      ElMessage.error(res.message || '删除会话失败')
    }
  } catch (error) {
    console.error('删除会话失败:', error)
    ElMessage.error('删除会话失败，请重试')
  } finally {
    isDeleting.value = false
  }
}

// 简单换行格式
const formatMessageContent = (content) => {
  return content.replace(/\n/g, '<br>')
}

// 情绪花园
const currentEmotion = ref({
  primaryEmotion: '中性',
  emotionScore: 50,
  isNagative: false
})

// 获取情绪强度类名
const getIntensityClass = (score) => {
  if(score > 60) {
    return 3
  } else if(score > 30) {
    return 2
  } else {
    return 1
  }
}



</script>

<template>
  <div class="consultation-container">
    <div class="sidebar">
      <div class="ai-assistant-info">
        <div class="breathing-circle">
          <el-image :src="iconUrl1" style="width: 25px;height: 25px;"></el-image>
        </div>
        <h3 class="assistant-name">AI助手</h3>
        <div class="online-status">
          <div class="status-dot"></div>
           在线服务中
        </div>
      </div>  
      <!-- 情绪花园 -->
       <div class="emotion-garden">
        <div class="garden-header">
          <div class="garden-title">情绪花园</div>
        </div>
        <div class="emotion-info">
          <div class="emotion-name">{{ currentEmotion.primaryEmotion }}</div>
          <div class="emotion-score">{{ currentEmotion.emotionScore }}</div>
        </div>
        <div class="warm-tips">
          <div class="emotion-status-text">
            <span class="status-label">今天感觉：</span>
            <div class="status-emotion">{{ currentEmotion.isNagative === true ? '不错' : '一般' }}</div>
          </div>
          <div class="emtion-intensity">
            <span class="intensity-dots">
              <span v-for="(dot, index) in 3" :key="index" class="dot" :class="{'active': index < getIntensityClass(currentEmotion.emotionScore)}"></span>
            </span>
          </div>
        </div>
       </div>

        <!-- 会话列表 -->
         <div class="session-history">
          <h4 class="session-title">历史会话</h4>
          <div ref="historyBodyRef" class="session-list">
            <div v-for="item in chatList" :key="item.id" @click="handleChatClick(item)" class="session-item">
              <div class="session-info">
                <div class="session-title">
                  <span>{{ item.sessionTitle }}</span>
                  <div class="session-meta">
                    <span class="session-time">{{  item.startedAt }}</span>
                  </div>
                  <div class="session-preview">
                    {{ item.lastMessageContent }}
                  </div>
                  <div class="session-stats">
                    <span>
                      <el-icon><ChatRound /></el-icon>
                      {{ item.messageCount || 0 }}
                    </span>
                    <span>
                      <el-icon><Clock /></el-icon>
                      {{ item.lastMessageTime || 0 }}分钟
                    </span>
                  </div>
                </div>
                <div class="session-actions">
                    <el-button text type="danger" size="mini" @click="handleDeleteChat(item)" :loading="isDeleting">
                      <el-icon><DeleteFilled /></el-icon>
                    </el-button>
                  </div>
              </div>
            </div>
          </div>
         </div>
    </div>
    <div class="chat-main">
      <!-- <div class="chat-header">
        <div class="header-left">
          <div class="chat-avatar">
            <el-image :src="iconUrl2" style="width: 25px;height: 25px;"></el-image>
          </div>
          <div class="chat-info">
            <h2>AI助手</h2>
            <p>您贴心的心理健康助手</p>
          </div>
        </div>
        <el-button @click="handleNewChat">
          <div>
            新会话
            <el-icon><Plus /></el-icon>
          </div>
        </el-button>
      </div> -->
      <!-- 聊天消息区域 -->
       <div ref="chatBodyRef" class="chat-messages">
         <div class="message-item ai-message" v-if="message.length === 0">
          <div class="message-avatar">
            <el-image :src="iconUrl1" style="width: 18px;height: 18px;"></el-image>
          </div>
          <div class="message-content">
            <div class="message-bubble">
              <p>您好！我是您的AI健康助手。很高心能陪伴您，为您提供温暖的心理支持！</p>
            </div>
            <div class="message-time">刚刚</div>
          </div>
        </div>
        <div v-for="(item, index) in message" :key="item.id" class="message-item">
          <!-- <div :class="item.senderType === 1 ? 'user-message' : 'ai-message'">
            <el-image class="message-avatar" :src="item.senderType === 1 ? userIcon : iconUrl1"></el-image>
          </div> -->
          <div class="message-content">
            <div class="message-bubble">
              <!-- ai正在输入中 -->
              <div v-if="item.senderType === 2 && aiIsTyping && !item.content" class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
              </div>
              <!-- ai错误提示 -->
               <div v-else-if="item.isError" class="error-message">
                <p>{{ item.content }}</p>
               </div>
               <!-- ai正常回复 -->
                <MarkdownRenderer v-else-if="item.senderType === 2 && !item.isError" :content="item.content" :is-ai-message="true" />
               <p v-else-if="item.content" v-html="formatMessageContent(item.content)"></p>
              </div>
          </div>
        </div>
       </div>
       <!-- 输入框 -->
        <div class="chat-input">
          <div class="input-container">
            <el-input 
            v-model="userInput"
            placeholder="请输入您要分享的内容"
            type="textarea"
            :rows="3"
            :disabled="aiIsTyping"
            @keydown.enter="handleSendMessage"
            class="message-input"></el-input>
            <div class="input-footer">
              <span>按住Enter键发送, shift+Enter换行</span>
              <span>{{ userInput.length }}/500</span>
            </div>
          </div>
          <el-button :disabled="!userInput.trim() || userInput.length > 500" @click="handleSendMessage" type="primary" class="send-btn">
            <el-icon><Promotion /></el-icon>
          </el-button>
        </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.consultation-container {
    margin: 0 auto;
    width: 1200px;
    display: flex;
    gap: 20px;
    padding: 20px;
    .sidebar {
        width: 320px;
        .ai-assistant-info {
            margin-bottom: 20px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 252, 248, 0.95) 100%);
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 8px 32px rgba(251, 146, 60, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04);
            border: 1px solid rgba(251, 146, 60, 0.08);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            .breathing-circle {
                width: 60px;
                height: 60px;
                background: #ff9a9e;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 12px;
                animation: breathing 4s ease-in-out infinite;
                box-shadow: 0 6px 24px rgba(251, 146, 60, 0.25);
                position: relative;
            }
            .assistant-name {
                font-size: 16px;
                font-weight: 700;
                background: linear-gradient(135deg,#ff9a9e, rgb(255, 221, 186));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-align: center;
                background-clip: text;
                margin: 0 0 12px;
            }
            .online-status {
                display: flex;
                align-items: center;
                justify-content: center;
                color: #059669;
                font-size: 12px;
                font-weight: 600;
                .status-dot {
                    width: 8px;
                    height: 8px;
                    background: #059669;
                    border-radius: 50%;
                    margin-right: 8px;
                    animation: pulse 2s infinite;
                    box-shadow: 0 0 8px rgba(5, 150, 105, 0.4);
                }
            }
        }
        .session-history {
            background: white;
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
            min-height: 250px;
            display: flex;
            flex-direction: column;
            .section-title {
                font-size: 16px;
                font-weight: 600;
                color: #333;
                margin: 0 0 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                
            }
            .session-list {
                overflow-y: auto;
                max-height: 200px;
                scrollbar-width: thin;
                scrollbar-color: rgba(64, 150, 255, 0.3) transparent;
                .session-item {
                    position: relative;
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 12px;
                    margin-bottom: 8px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: 2px solid transparent;
                    &:hover {
                        background: #f8f9ff;
                        border-color: #e6f0ff;
                    }
                    &.active {
                        background: #e6f0ff;
                        border-color: #4096ff;
                    }
                    .session-info {
                        flex: 1;
                        .session-title {
                            font-weight: 500;
                            font-size: 14px;
                            color: #333;
                            margin-bottom: 4px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            .session-meta {
                                display: flex;
                                align-items: center;
                                gap: 8px;
                                margin-bottom: 6px;
                                .session-time {
                                    font-size: 12px;
                                    color: #999;
                                }
                            }
                            .session-preview {
                                width: 200px;
                                font-size: 12px;
                                color: #666;
                                margin-bottom: 6px;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                            .session-stats {
                                display: flex;
                                align-items: center;
                                gap: 12px;
                                span {
                                    font-size: 12px;
                                    color: #999;
                                    display: flex;
                                    align-items: center;
                                    gap: 4px;
                                }
                            }
                        }
                        .session-actions {
                            position: absolute;
                            top: 10px;
                            right: 12px;
                        }
                    }
                }
                .no-sessions-text {
                    text-align: center;
                    font-size: 14px;
                    color: #999;
                }
            }
        }
        .emotion-garden {
            background: linear-gradient(135deg, #fef9e7 0%, #fcf4e6 50%, #f6f0e8 100%);
            border-radius: 20px;
            padding: 16px;
            margin-bottom: 20px;
            box-shadow: 0 8px 32px rgba(252, 244, 230, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.2);
            position: relative;
            overflow: hidden;
            min-height: 100px;
            
            .garden-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20px;
                position: relative;
                z-index: 2;
                .garden-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    color: #8b4513;
                }
            }
            .emotion-info {
                margin: 0 auto;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 10;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.8);
                background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
                color: #fff;
                .emotion-name {
                    font-size: 15px;
                    font-weight: 600;
                    line-height: 1;
                    margin-bottom: 2px;
                }
                .emotion-score {
                    font-size: 14px;
                    font-weight: 700;
                    opacity: 0.9;
                }
            }
            .warm-tips {
                text-align: center;
                margin-bottom: 16px;
                .emotion-status-text {
                    margin-bottom: 12px;
                    .status-label {
                        font-size: 14px;
                        color: #8b7355;
                        margin-right: 8px;
                    }
                    .status-emotion {
                        font-size: 16px;
                        font-weight: 600;
                        padding: 4px 12px;
                        border-radius: 16px;
                        display: inline-block;
                    }
                }
                .emotion-intensity {
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    .intensity-dots {
                        display: flex;
                        gap: 4px;
                        .dot {
                            width: 8px;
                            height: 8px;
                            border-radius: 50%;
                            background: #e0e0e0;
                            transition: all 0.3s ease;
                            &.active {
                                background: linear-gradient(135deg, #ff9a9e, #fecfef);
                                transform: scale(1.2);
                                box-shadow: 0 2px 8px rgba(255, 154, 158, 0.4);
                            }
                        }
                    }
                    .intensity-text {
                        font-size: 12px;
                        color: #8b7355;
                        font-weight: 500;
                    }
                }
                .warm-suggestion {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8));
                    border-radius: 16px;
                    padding: 12px;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.6);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
                    .suggestion-icon {
                        font-size: 20px;
                        flex-shrink: 0;
                        margin-top: 2px;
                    }
                    .suggestion-content {
                        text-align: left;
                        flex: 1;
                        .suggestion-title {
                            font-size: 14px;
                            font-weight: 600;
                            color: #8b7355;
                            margin-bottom: 6px;
                        }
                        .suggestion-text {
                            font-size: 13px;
                            color: #6b5b47;
                            line-height: 1.5;
                        }
                    }
                }
                .healing-actions {
                    margin-bottom: 16px;
                    .actions-title {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        font-size: 14px;
                        font-weight: 600;
                        color: #8b7355;
                        margin-bottom: 16px;
                    }
                    .actions-list {
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                        .action-item {
                            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
                            border-radius: 12px;
                            padding: 12px;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            border: 1px solid rgba(255, 255, 255, 0.5);
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
                            text-align: left;
                            .action-icon {
                                font-size: 14px;
                                color: #ffd700;
                                flex-shrink: 0;
                            }
                            .action-text {
                                font-size: 12px;
                                color: #6b5b47;
                                line-height: 1.4;
                                flex: 1;
                            }
                        }
                    }
                }
                .risk-notice {
                    background: linear-gradient(135deg, #fff9e6, #ffeaa7);
                    border-radius: 16px;
                    padding: 16px;
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    border: 1px solid rgba(255, 234, 167, 0.6);
                    box-shadow: 0 6px 20px rgba(255, 234, 167, 0.3);
                    .notice-icon {
                        font-size: 20px;
                        flex-shrink: 0;
                        margin-top: 2px;
                    }
                    .notice-content {
                        flex: 1;
                        .notice-title {
                            font-size: 14px;
                            font-weight: 600;
                            color: #ddbb88;
                            margin-bottom: 6px;
                        }
                        .notice-text {
                            font-size: 13px;
                            color: #b8740c;
                            line-height: 1.5;
                        }
                    }
                }
            }
        }
    }
    .chat-main {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 252, 250, 0.98) 100%);
        border-radius: 20px;
        box-shadow: 0 12px 40px rgba(251, 146, 60, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
        border: 1px solid rgba(251, 146, 60, 0.1);
        backdrop-filter: blur(10px);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        flex: 1;
        max-height: 685px;
        .chat-header {
            background: linear-gradient(-45deg,  #ffe0fd , #fad0c4, #ff9a9e);
            color: #6E5A49;
            padding: 20px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            flex-shrink: 0;
            .header-left {
                display: flex;
                align-items: center;
                .chat-avatar {
                    width: 48px;
                    height: 48px;
                    background: rgba(255, 255, 255, 0.25);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 16px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    position: relative;
                    z-index: 1;
                }
                .chat-info {
                    h2 {
                        font-size: 20px;
                        font-weight: 700;
                        margin-bottom: 4px;
                    }
                    p {
                        font-size: 14px;
                    }
                }
            }
        }
        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 46px;
            padding-top: 50px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 252, 248, 0.05) 100%);
            min-height: 0;
            max-height: calc(100vh - 200px);
            scrollbar-width: thin;
            scrollbar-color: rgba(251, 146, 60, 0.3) transparent;
            .message-item {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                > div {
                    .message-avatar {
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        color: white;
                        flex-shrink: 0;
                        overflow: hidden;
                    }
                    .message-avatar img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                    &.ai-message {
                        .message-avatar {
                            background: linear-gradient(135deg, #fb923c, #f59e0b);
                            box-shadow: 0 4px 12px rgba(251, 146, 60, 0.3);
                        }
                    }
                    &.user-message {
                        .message-avatar {
                            background: linear-gradient(135deg, #6b7280, #4b5563);
                            box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
                        }
                    }
                }
                .message-content {
                    max-width: 70%;
                    .message-bubble {
                        background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 252, 248, 0.95) 100%);
                        border-radius: 16px;
                        padding: 12px 16px;
                        position: relative;
                        animation: fadeInUp 0.4s ease-out;
                        border: 1px solid rgba(251, 146, 60, 0.1);
                        box-shadow: 0 4px 16px rgba(251, 146, 60, 0.05);
                        .typing-indicator {
                            display: flex;
                            gap: 4px;
                            padding: 8px 0;
                            .typing-dot {
                                width: 8px;
                                height: 8px;
                                background: #ccc;
                                border-radius: 50%;
                                animation: typing 1.5s ease-in-out infinite;
                                &:nth-child(2) {
                                    animation-delay: 0.2s;
                                }
                                &:nth-child(3) {
                                    animation-delay: 0.4s;
                                }   
                            }
                        }
                        /* 错误消息样式 */
                        .error-message {
                            background: linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%);
                            border: 1px solid #F87171;
                            border-radius: 12px;
                            padding: 12px 16px;
                            color: #991B1B;
                            font-weight: 500;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                        }
                    }
                    .message-time {
                        font-size: 12px;
                        color: #999;
                        margin-top: 4px;
                    }
                }
            }
        }
        .chat-input {
            border-top: 1px solid rgba(251, 146, 60, 0.1);
            padding: 20px 24px;
            display: flex;
            gap: 12px;
            align-items: flex-end;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 252, 248, 0.7) 100%);
            backdrop-filter: blur(10px);
            flex-shrink: 0;
            .input-container {
                flex: 1;
            }
            .input-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 12px;
                color: #78716c;
                font-weight: 500;
            }
            .send-btn {
                height: 73px;
                width: 73px;
                border-radius: 16px;
                background: linear-gradient(90deg, #fcccbc 0%, #fcb69f 100%) !important;
                border: none !important;
                box-shadow: 0 6px 20px rgba(251, 146, 60, 0.25);
                transition: all 0.3s ease;
                margin-bottom: 15px;
            }

        }

    }
}
</style>
