const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');
const articleController = require('./controllers/articleController');
const consultationController = require('./controllers/consultationController');
const emotionalController = require('./controllers/emotionalController');
const analyticsController = require('./controllers/analyticsController');
const fileController = require('./controllers/fileController');
const authMiddleware = require('./middleware/auth');

// 用户相关路由
router.post('/user/add', userController.register);
router.post('/user/login', userController.login);
router.post('/user/logout', userController.logout);

// 文章相关路由
router.get('/knowledge/category/tree', articleController.getCategoryTree);
router.get('/knowledge/article/page', articleController.getArticleList);
router.post('/knowledge/article', authMiddleware, articleController.createArticle);
router.get('/knowledge/article/:id', articleController.getArticleDetail);
router.put('/knowledge/article/:id', authMiddleware, articleController.updateArticle);
router.put('/knowledge/article/:id/status', authMiddleware, articleController.updateArticleStatus);
router.delete('/knowledge/article/:id', authMiddleware, articleController.deleteArticle);

// 咨询相关路由
router.post('/psychological-chat/session/start', authMiddleware, consultationController.createSession);
router.get('/psychological-chat/sessions', authMiddleware, consultationController.getSessions);
router.delete('/psychological-chat/sessions/:sessionId', authMiddleware, consultationController.deleteSession);
router.get('/psychological-chat/sessions/:sessionId/messages', authMiddleware, consultationController.getSessionMessages);
router.post('/api/ai.stream', authMiddleware, consultationController.streamAIResponse);
router.post('/api/analyze-emotion', authMiddleware, consultationController.analyzeEmotion);

// 情绪日记相关路由
router.post('/emotion-diary', authMiddleware, emotionalController.submitEmotionDiary);
router.get('/emotion-diary/admin/page', emotionalController.getEmotionalList);
router.delete('/emotion-diary/admin/:id', emotionalController.deleteEmotional);

// 数据统计相关路由
router.get('/data-analytics/overview', authMiddleware, analyticsController.getOverview);

// 文件上传相关路由
router.post('/file/upload', authMiddleware, fileController.uploadFile);

module.exports = router;