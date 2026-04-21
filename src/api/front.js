import service from '@/utils/request.js'

// 注册
export const registerAccount = (data) => {
  console.log(data)
  return service.post('/user/add', data)
}

// 创建新会话
export const createNewChat = (data) => {
  return service.post('/psychological-chat/session/start', data)
}

// 分页查询会话记录
export const getChatList = (data) => {
  return service.get('/psychological-chat/sessions', data)
}

// 删除查询会话记录
export const deleteChat = (sessionId) => {
  return service.delete(`/psychological-chat/sessions/${sessionId}`)
}

// 获取会话记录
export const getChatDetail = (sessionId) => {
  return service.get(`/psychological-chat/sessions/${sessionId}/messages`)
}

// 情绪分析
export const analyzeEmotion = (content) => {
  return service.post('/api/analyze-emotion', { content })
}

// 提交情绪日志
export const submitEmotionDiary = (data) => {
  return service.post('/emotion-diary', data)
}

// 查询文章列表
export const getArticleList = (params) => {
  return service.get('/knowledge/article/page', { params })
}

// 获取知识文章详情
export const getArticleDetail = (id) => {
  return service.get(`/knowledge/article/${id}`)
}