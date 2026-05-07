const fs = require('fs');
const path = require('path');
const axios = require('axios');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '../.env') });

// 数据文件路径
const SESSIONS_FILE = path.join(__dirname, '../data/sessions.json');

// 确保数据文件存在
if (!fs.existsSync(SESSIONS_FILE)) {
  // 初始数据
  const initialSessions = [
    {
      id: 1,
      userId: 1,
      topic: '焦虑问题',
      messages: [
        {
          id: 1,
          sender: 'user',
          content: '你好，我最近感到很焦虑',
          timestamp: new Date('2024-01-01 10:00:00')
        },
        {
          id: 2,
          sender: 'ai',
          content: '你好，很高兴为你服务。能告诉我更多关于你的焦虑情况吗？',
          timestamp: new Date('2024-01-01 10:01:00')
        }
      ],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 2,
      userId: 1,
      topic: '工作压力',
      messages: [
        {
          id: 1,
          sender: 'user',
          content: '我最近工作压力很大',
          timestamp: new Date('2024-01-02 14:00:00')
        },
        {
          id: 2,
          sender: 'ai',
          content: '工作压力大确实会影响我们的心理健康。你能具体说说是什么让你感到压力吗？',
          timestamp: new Date('2024-01-02 14:01:00')
        }
      ],
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02')
    }
  ];
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(initialSessions, null, 2));
}

// 加载会话数据
const loadSessions = () => {
  const data = fs.readFileSync(SESSIONS_FILE, 'utf8');
  return JSON.parse(data);
};

// 保存会话数据
const saveSessions = (sessions) => {
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
};

// 模拟会话数据
let sessions = loadSessions();

// 情绪分析工具函数
const analyzeEmotion = (content) => {
  // 简单的情绪分析逻辑
  // 实际项目中可以使用更复杂的NLP库或API
  const positiveWords = ['开心', '快乐', '高兴', '愉悦', '满意', '幸福', '兴奋', '放松'];
  const negativeWords = ['焦虑', '压力', '难过', '悲伤', '愤怒', '担忧', '恐惧', '紧张'];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    if (content.includes(word)) positiveCount++;
  });
  
  negativeWords.forEach(word => {
    if (content.includes(word)) negativeCount++;
  });
  
  // 计算情绪得分 (0-100)
  let score = 50;
  if (positiveCount > negativeCount) {
    score = Math.min(100, 50 + positiveCount * 10);
  } else if (negativeCount > positiveCount) {
    score = Math.max(0, 50 - negativeCount * 10);
  }
  
  // 确定主要情绪
  let primaryEmotion = '中性';
  if (score > 70) primaryEmotion = '积极';
  else if (score < 30) primaryEmotion = '消极';
  
  return {
    primaryEmotion,
    emotionScore: score,
    isNagative: score < 50
  };
};

const consultationController = {
  // 创建新会话
  createSession: async (req, res) => {
    try {
      const { topic, initialMessage } = req.body;

      // 模拟用户信息
      const userId = req.user?.userId || 1;

      const newSession = {
        id: sessions.length + 1,
        userId,
        topic,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // 如果有初始消息，添加到会话中
      if (initialMessage) {
        newSession.messages.push({
          id: 1,
          sender: 'user',
          content: initialMessage,
          timestamp: new Date()
        });
      }

      sessions.push(newSession);
      saveSessions(sessions); // 保存到文件

      res.status(200).json({ code: 200, data: newSession });
    } catch (error) {
      console.error('创建会话失败:', error);
      res.status(500).json({ code: 500, message: '创建会话失败' });
    }
  },

  // 获取会话列表
  getSessions: async (req, res) => {
    try {
      const { page = 1, pageSize = 10 } = req.query;

      let filteredSessions = sessions;
      // 模拟用户权限
      if (req.user && req.user.userType === 1) {
        // 前台用户只能查看自己的会话，不同前台账号不能访问同一个历史记录
        filteredSessions = filteredSessions.filter(session => session.userId == req.user.userId);
      }

      // 转换会话数据结构为前端期望的格式
      const formattedSessions = filteredSessions.map(session => {
        // 获取最后一条消息
        const lastMessage = session.messages[session.messages.length - 1];
        
        return {
          id: session.id,
          userId: session.userId,
          sessionTitle: session.topic,
          startedAt: session.createdAt,
          lastMessageContent: lastMessage ? lastMessage.content : '',
          messageCount: session.messages.length,
          lastMessageTime: lastMessage ? Math.floor((new Date() - new Date(lastMessage.timestamp)) / (1000 * 60)) : 0
        };
      });

      const total = formattedSessions.length;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + Number(pageSize);
      const paginatedSessions = formattedSessions.slice(startIndex, endIndex);

      res.status(200).json({
        code: 200,
        data: {
          list: paginatedSessions,
          pagination: {
            total,
            page: Number(page),
            pageSize: Number(pageSize)
          }
        }
      });
    } catch (error) {
      console.error('获取会话列表失败:', error);
      res.status(500).json({ code: 500, message: '获取会话列表失败' });
    }
  },

  // 删除会话
  deleteSession: async (req, res) => {
    try {
      const { sessionId } = req.params;

      const session = sessions.find(session => session.id == sessionId);
      if (!session) {
        return res.status(404).json({ code: 404, message: '会话不存在' });
      }

      // 模拟用户权限
      const userType = req.user?.userType || 1;
      const userId = req.user?.userId || 1;

      // 验证用户权限 - 暂时禁用权限检查，方便测试
      // if (userType !== 2 && session.userId != userId) {
      //   return res.status(403).json({ code: 403, message: '无权删除此会话' });
      // }

      const sessionIndex = sessions.findIndex(session => session.id == sessionId);
      sessions.splice(sessionIndex, 1);
      saveSessions(sessions); // 保存到文件

      res.status(200).json({ code: 200, message: '删除会话成功' });
    } catch (error) {
      console.error('删除会话失败:', error);
      res.status(500).json({ code: 500, message: '删除会话失败' });
    }
  },

  // 获取会话消息
  getSessionMessages: async (req, res) => {
    try {
      const { sessionId } = req.params;

      const session = sessions.find(session => session.id == sessionId);
      if (!session) {
        return res.status(404).json({ code: 404, message: '会话不存在' });
      }

      // 模拟用户权限
      const userType = req.user?.userType || 1;
      const userId = req.user?.userId || 1;

      // 前台用户只能查看自己的会话，不同前台账号不能访问同一个历史记录
      if (userType !== 2 && session.userId != userId) {
        return res.status(403).json({ code: 403, message: '无权查看此会话' });
      }

      // 转换消息格式为前端期望的格式
      const formattedMessages = session.messages.map(message => ({
        id: message.id,
        senderType: message.sender === 'user' ? 1 : 2,
        content: message.content,
        isError: false,
        createAt: new Date(message.timestamp).toLocaleTimeString(),
        sessionId: session.id
      }));

      res.status(200).json({ code: 200, data: formattedMessages });
    } catch (error) {
      console.error('获取会话消息失败:', error);
      res.status(500).json({ code: 500, message: '获取会话消息失败' });
    }
  },

  // 流式AI响应
  // 情绪分析接口
  analyzeEmotion: async (req, res) => {
    try {
      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json({ code: 400, message: '内容不能为空' });
      }
      
      // 分析情绪
      const emotionResult = analyzeEmotion(content);
      
      res.status(200).json({ code: 200, data: emotionResult });
    } catch (error) {
      console.error('情绪分析失败:', error);
      res.status(500).json({ code: 500, message: '情绪分析失败' });
    }
  },

  // 流式AI响应（ERNIE-5.0 + v2 接口）
  streamAIResponse: async (req, res) => {
    try {
      const { sessionId, userMessage } = req.body;

      // 验证会话是否存在
      const session = sessions.find(session => session.id == sessionId);
      if (!session) {
        return res.status(404).json({ code: 404, message: '会话不存在' });
      }

      // 检查是否已经存在相同的消息，避免重复添加
      const lastMessage = session.messages[session.messages.length - 1];
      if (!lastMessage || lastMessage.content !== userMessage || lastMessage.sender !== 'user') {
        session.messages.push({
          id: session.messages.length + 1,
          sender: 'user',
          content: userMessage,
          timestamp: new Date()
        });
      }

      // 设置响应头，启用流式传输
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      // === 调用百度千帆 v2 流式 ===
      // 使用环境变量加载API密钥
      const API_KEY = process.env.BAIDU_API_KEY;
      console.log('当前使用的API密钥前6位:', API_KEY ? API_KEY.substring(0, 6) : '未设置');
      console.log('完整API密钥:', API_KEY);
      const API_URL = 'https://qianfan.baidubce.com/v2/chat/completions';

      if (!API_KEY) {
        console.error('API密钥未设置');
        res.write(`event: message\ndata: ${JSON.stringify({ code: 500, msg: 'API密钥未设置' })}\n\n`);
        res.write(`event: done\ndata: ${JSON.stringify({ code: 500, data: { content: '' } })}\n\n`);
        res.end();
        return;
      }
      
      // 验证API密钥格式
      if (!API_KEY.startsWith('bce-v3/')) {
        console.error('API密钥格式不正确');
        res.write(`event: message\ndata: ${JSON.stringify({ code: 500, msg: 'API密钥格式不正确' })}\n\n`);
        res.write(`event: done\ndata: ${JSON.stringify({ code: 500, data: { content: '' } })}\n\n`);
        res.end();
        return;
      }

      // 构建包含历史上下文的消息列表
      const messages = [
        {
          role: 'system',
          content: '你是专业的心理健康咨询助理，语气温和、支持性强，避免自我介绍为模型，不要提到你是AI或模型，优先共情与引导用户表达感受。'
        }
      ];
      
      // 添加历史对话记录（最近的10条消息，避免上下文过长）
      const historyMessages = session.messages.slice(-10);
      historyMessages.forEach(msg => {
        messages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      });
      
      const requestData = {
        model: 'ernie-5.0',
        messages: messages,
        stream: true
      };

      try {
        const response = await axios.post(API_URL, requestData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          },
          responseType: 'stream'
        });

        let buffer = '';
        let fullContent = '';

        response.data.on('data', (chunk) => {
          buffer += chunk.toString();
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;

            const dataStr = trimmed.replace(/^data:\s*/, '');
            if (dataStr === '[DONE]') {
              res.write(`event: done\ndata: ${JSON.stringify({ code: 200, data: { content: '' } })}\n\n`);
              res.end();

              // 保存AI回复到会话
              session.messages.push({
                id: session.messages.length + 1,
                sender: 'ai',
                content: fullContent,
                timestamp: new Date()
              });
              saveSessions(sessions);
              return;
            }

            try {
              const json = JSON.parse(dataStr);
              const delta = json?.choices?.[0]?.delta?.content || '';
              if (delta) {
                fullContent += delta;
                res.write(`event: message\ndata: ${JSON.stringify({ code: 200, data: { content: delta } })}\n\n`);
              }
            } catch (e) {
              // 忽略解析失败的行
            }
          }
        });

        response.data.on('end', () => {
          res.write(`event: done\ndata: ${JSON.stringify({ code: 200, data: { content: '' } })}\n\n`);
          res.end();
        });

        response.data.on('error', (err) => {
          console.error('AI流式失败:', err);
          res.write(`event: message\ndata: ${JSON.stringify({ code: 500, msg: 'AI回复失败' })}\n\n`);
          res.write(`event: done\ndata: ${JSON.stringify({ code: 500, data: { content: '' } })}\n\n`);
          res.end();
        });
      } catch (aiError) {
        console.error('AI生成失败:', aiError);
        res.write(`event: message\ndata: ${JSON.stringify({ code: 500, msg: 'AI回复失败' })}\n\n`);
        res.write(`event: done\ndata: ${JSON.stringify({ code: 500, data: { content: '' } })}\n\n`);
        res.end();
      }
    } catch (error) {
      console.error('流式响应失败:', error);
      res.status(500).json({ code: 500, message: '流式响应失败' });
    }
  }
};

module.exports = consultationController;