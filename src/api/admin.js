import service from '@/utils/request.js'

// 登陆响应
export const login = (data) => {
  console.log(data)
  return service.post('/user/login', data)
}

// 获取文章分类
export const getCategoryTree = () => {
  return service.get('/knowledge/category/tree')
}

// 获取文章列表
export const getArticleList = (params) => {
  return service.get('/knowledge/article/page', {params})
}

// 上传封面
export const uploadCover = (file, businessInfo) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('businessType', 'ARTICLE')
  formData.append('businessId', businessInfo.businessId)
  formData.append('businessId', businessInfo.businessField)
  return service.post('/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 创建文章
export const createArticle = (data) => {
  return service.post('/knowledge/article', data)
}

// 获取知识文章详情
export const editArticle = (id) => {
  return service.get(`/knowledge/article/${id}`)
}

// 编辑文章
export const updateArticle = (id, data) => {
  return service.put(`/knowledge/article/${id}`, data)
}

// 更新文章状态
export const updateArticleStatus = (id, status) => {
  return service.put(`/knowledge/article/${id}/status`, {status})
}

// 删除知识文章
export const deleteArticle = (id) => {
  return service.delete(`/knowledge/article/${id}`)
}

// 咨询记录列表获取
export const getConsultationList = (params) => {
  return service.get('/psychological-chat/sessions', {params})
}

// 咨询记录详情获取
export const getConsultationDetail = (sessionId) => {
  return service.get(`/psychological-chat/sessions/${sessionId}/messages`)
}

// 情绪日记列表获取
export const getEmotionalList = (params) => {
  return service.get('/emotion-diary/admin/page', {params})
}

// 删除情绪日记
export const deleteEmotional = (id) => {
  return service.delete(`/emotion-diary/admin/${id}`)
}

// 综合数据分析获取
export const getAnalysisData = () => {
  return service.get('/data-analytics/overview')
}

// 退出登陆
export const logoutAccount = () => {
  return service.post('/user/logout')
}
