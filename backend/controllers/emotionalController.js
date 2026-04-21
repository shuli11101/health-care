const fs = require('fs');
const path = require('path');

// 数据文件路径
const EMOTIONAL_FILE = path.join(__dirname, '../data/emotionalDiaries.json');

// 确保数据文件存在
if (!fs.existsSync(EMOTIONAL_FILE)) {
  // 初始数据
  const initialDiaries = [
  {
    id: 1,
    userId: 1,
    username: 'user1',
    nickname: '用户1',
    diaryDate: new Date('2024-01-01').toLocaleDateString(),
    moodScore: 8,
    emotion: 'happy',
    content: '今天心情很好，完成了所有工作任务，还和朋友一起吃了晚饭。',
    createdAt: new Date('2024-01-01').toLocaleDateString(),
    updatedAt: new Date('2024-01-01').toLocaleDateString(),
    sleepQuality: 3,
    stressLevel: 2,
    factor: '出去玩',
    primaryEmotion: '开心',
    dominantEmotion: '开心',
    aiEmotionAnalysis: {
      primaryEmotion: '开心',
      emotionScore: 8,
      riskLevel: 0,
      suggestion: '继续保持好的心情，多运动，多休息。',
      riskDescription: '风险等级为0，风险描述为：无风险。',
      improvementSuggestions: ['多运动，多休息，保持好的心情。']
    }
  },
  {
    id: 2,
    userId: 1,
    username: 'user2',
    nickname: '用户2',
    diaryDate: new Date('2024-01-02').toLocaleDateString(),
    moodScore: 5,
    emotion: 'neutral',
    content: '今天工作有点累，感觉压力有点大。',
    createdAt: new Date('2024-01-02').toLocaleDateString(),
    updatedAt: new Date('2024-01-02').toLocaleDateString(),
    sleepQuality: 3,
    stressLevel: 4,
    factor: '工作',
    primaryEmotion: '疲惫',
    dominantEmotion: '疲惫',
    aiEmotionAnalysis: {
      primaryEmotion: '疲惫',
      emotionScore: 5,
      riskLevel: 4,
      suggestion: '多休息，多运动，保持好的心情。',
      riskDescription: '风险等级为4，风险描述为：工作压力大。',
      improvementSuggestions: ['多休息，多运动，保持好的心情。']
    }
  },
  {
    id: 3,
    userId: 1,
    username: 'user3',
    nickname: '用户3',
    diaryDate: new Date('2024-01-03').toLocaleDateString(),
    moodScore: 7,
    emotion: 'happy',
    content: '今天天气很好，出去散步了，感觉很放松。',
    createdAt: new Date('2024-01-03').toLocaleDateString(),
    updatedAt: new Date('2024-01-03').toLocaleDateString(),
    sleepQuality: 4,
    stressLevel: 1,
    factor: '散步',
    primaryEmotion: '放松',
    dominantEmotion: '放松',
    aiEmotionAnalysis: {
      primaryEmotion: '放松',
      emotionScore: 7,
      riskLevel: 0,
      suggestion: '继续保持好的心情，多运动，多休息。',
      riskDescription: '风险等级为0，风险描述为：无风险。',
      improvementSuggestions: ['多运动，多休息，保持好的心情。']
    }
  }
];
  fs.writeFileSync(EMOTIONAL_FILE, JSON.stringify(initialDiaries, null, 2));
}

// 加载情绪日记数据
const loadEmotionalDiaries = () => {
  const data = fs.readFileSync(EMOTIONAL_FILE, 'utf8');
  return JSON.parse(data);
};

// 保存情绪日记数据
const saveEmotionalDiaries = (diaries) => {
  fs.writeFileSync(EMOTIONAL_FILE, JSON.stringify(diaries, null, 2));
};

// 模拟情绪日记数据
let emotionalDiaries = loadEmotionalDiaries();

const emotionalController = {
  // 获取情绪日记列表
  getEmotionalList: async (req, res) => {
    try {
      const { page = 1, pageSize = 10 } = req.query;
      
      const total = emotionalDiaries.length;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + Number(pageSize);
      const paginatedDiaries = emotionalDiaries.slice(startIndex, endIndex);
      
      res.status(200).json({
        code: 200,
        data: {
          list: paginatedDiaries,
          pagination: {
            total,
            page: Number(page),
            pageSize: Number(pageSize)
          }
        }
      });
    } catch (error) {
      console.error('获取情绪日记列表失败:', error);
      res.status(500).json({ code: 500, message: '获取情绪日记列表失败' });
    }
  },
  
  // 提交情绪日记
  submitEmotionDiary: async (req, res) => {
    try {
      const { diaryDate, moodScore, dominantEmotion, emotionTriggers, diaryContent, sleepQuality, stressLevel } = req.body;
      
      // 获取用户信息
      const userId = req.user?.userId || 1;
      const userInfo = req.user?.userInfo || { username: 'user', nickname: '用户' };
      
      // 生成情绪日记ID
      const id = emotionalDiaries.length + 1;
      
      // 创建新的情绪日记
      const newDiary = {
        id,
        userId,
        username: userInfo.username || 'user',
        nickname: userInfo.nickname || '用户',
        diaryDate: diaryDate || new Date().toLocaleDateString(),
        moodScore,
        emotion: dominantEmotion, // 映射前端的dominantEmotion到emotion
        content: diaryContent, // 映射前端的diaryContent到content
        createdAt: new Date().toLocaleDateString(),
        updatedAt: new Date().toLocaleDateString(),
        sleepQuality,
        stressLevel,
        factor: emotionTriggers, // 映射前端的emotionTriggers到factor
        primaryEmotion: dominantEmotion, // 映射前端的dominantEmotion到primaryEmotion
        dominantEmotion,
        aiEmotionAnalysis: '' // 默认为空
      };
      
      // 添加到情绪日记列表
      emotionalDiaries.push(newDiary);
      saveEmotionalDiaries(emotionalDiaries); // 保存到文件
      
      res.status(200).json({ code: 200, message: '提交情绪日记成功', data: newDiary });
    } catch (error) {
      console.error('提交情绪日记失败:', error);
      res.status(500).json({ code: 500, message: '提交情绪日记失败' });
    }
  },
  
  // 删除情绪日记
  deleteEmotional: async (req, res) => {
    try {
      const { id } = req.params;
      
      const diaryIndex = emotionalDiaries.findIndex(diary => diary.id == id);
      if (diaryIndex === -1) {
        return res.status(404).json({ code: 404, message: '情绪日记不存在' });
      }
      
      emotionalDiaries.splice(diaryIndex, 1);
      saveEmotionalDiaries(emotionalDiaries); // 保存到文件
      
      res.status(200).json({ code: 200, message: '删除情绪日记成功' });
    } catch (error) {
      console.error('删除情绪日记失败:', error);
      res.status(500).json({ code: 500, message: '删除情绪日记失败' });
    }
  }
};

module.exports = emotionalController;