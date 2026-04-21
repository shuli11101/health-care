// 模拟数据分析数据
const analyticsController = {
  // 获取综合数据分析
  getOverview: async (req, res) => {
    try {
      // 模拟数据
      const totalUsers = 100;
      const activeUsers = 75;
      const totalSessions = 200;
      const todayNewSessions = 15;
      const totalDiaries = 150;
      const todayNewDiaries = 10;
      const avgMoodScore = 7.2;
      
      // 模拟情绪趋势数据
      const emotionalTrend = [
        { date: '2026-04-10', avgMoodScore: 7.2, recordCount: 12 },
        { date: '2026-04-11', avgMoodScore: 6.8, recordCount: 15 },
        { date: '2026-04-12', avgMoodScore: 7.5, recordCount: 10 },
        { date: '2026-04-13', avgMoodScore: 7.0, recordCount: 18 },
        { date: '2026-04-14', avgMoodScore: 7.3, recordCount: 14 },
        { date: '2026-04-15', avgMoodScore: 6.9, recordCount: 16 },
        { date: '2026-04-16', avgMoodScore: 7.1, recordCount: 13 }
      ];
      
      // 模拟咨询统计数据
      const consultationStats = {
        totalSessions,
        avgDurationMinutes: 15,
        dailyTrend: [
          { date: '2026-04-10', sessionCount: 25, userCount: 20 },
          { date: '2026-04-11', sessionCount: 30, userCount: 25 },
          { date: '2026-04-12', sessionCount: 20, userCount: 18 },
          { date: '2026-04-13', sessionCount: 35, userCount: 30 },
          { date: '2026-04-14', sessionCount: 28, userCount: 22 },
          { date: '2026-04-15', sessionCount: 32, userCount: 26 },
          { date: '2026-04-16', sessionCount: 26, userCount: 21 }
        ]
      };
      
      // 模拟用户活跃度数据
      const userActivity = [
        { date: '2026-04-10', activeUsers: 60, newUsers: 5, diaryUsers: 30, consultationUsers: 25 },
        { date: '2026-04-11', activeUsers: 65, newUsers: 8, diaryUsers: 35, consultationUsers: 30 },
        { date: '2026-04-12', activeUsers: 55, newUsers: 3, diaryUsers: 28, consultationUsers: 22 },
        { date: '2026-04-13', activeUsers: 70, newUsers: 10, diaryUsers: 40, consultationUsers: 35 },
        { date: '2026-04-14', activeUsers: 68, newUsers: 7, diaryUsers: 38, consultationUsers: 32 },
        { date: '2026-04-15', activeUsers: 72, newUsers: 9, diaryUsers: 42, consultationUsers: 36 },
        { date: '2026-04-16', activeUsers: 66, newUsers: 6, diaryUsers: 36, consultationUsers: 30 }
      ];
      
      // 模拟咨询类型分布
      const consultationTypes = [
        { name: '焦虑', value: 35 },
        { name: '抑郁', value: 25 },
        { name: '压力管理', value: 20 },
        { name: '情感关系', value: 15 },
        { name: '其他', value: 5 }
      ];
      
      res.status(200).json({
        code: 200,
        data: {
          systemOverview: {
            totalUsers,
            activeUsers,
            totalSessions,
            todayNewSessions,
            totalDiaries,
            todayNewDiaries,
            avgMoodScore
          },
          emotionTrend: emotionalTrend,
          consultationStats,
          userActivity,
          consultationTypes
        }
      });
    } catch (error) {
      console.error('获取数据分析失败:', error);
      res.status(500).json({ code: 500, message: '获取数据分析失败' });
    }
  }
};

module.exports = analyticsController;