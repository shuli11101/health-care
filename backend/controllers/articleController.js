const fs = require('fs');
const path = require('path');

// 数据文件路径
const ARTICLES_FILE = path.join(__dirname, '../data/articles.json');

// 确保数据文件存在
if (!fs.existsSync(ARTICLES_FILE)) {
  // 初始数据
  const initialArticles = [
  {
    id: 1,
    title: '如何应对焦虑',
    content: '焦虑是一种常见的情绪反应，适当的焦虑可以帮助我们应对挑战，但过度的焦虑会影响我们的生活质量。本文将介绍一些应对焦虑的方法，包括深呼吸、冥想、运动等。通过这些方法，你可以更好地管理自己的情绪，提高生活质量。',
    categoryId: 2,
    categoryName: '焦虑',
    authorName: '专家',
    status: 1,
    coverImage: '',
    readCount: 1234,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 2,
    title: '抑郁症的早期症状',
    content: '抑郁症是一种常见的心理障碍，早期识别和干预非常重要。本文将介绍抑郁症的早期症状，帮助你及时发现并寻求帮助。常见的早期症状包括持续的情绪低落、兴趣减退、睡眠障碍、食欲变化等。如果你或身边的人出现这些症状，建议及时寻求专业帮助。',
    categoryId: 3,
    categoryName: '抑郁',
    authorName: '专家',
    status: 1,
    coverImage: '',
    readCount: 987,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  },
  {
    id: 3,
    title: '压力管理技巧',
    content: '现代生活中，压力无处不在。学会有效的压力管理技巧对保持心理健康至关重要。本文将介绍一些实用的压力管理方法，如时间管理、放松训练、社交支持等。通过这些方法，你可以更好地应对生活和工作中的压力，保持身心健康。',
    categoryId: 4,
    categoryName: '压力管理',
    authorName: '专家',
    status: 1,
    coverImage: '',
    readCount: 1567,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03')
  },
  {
    id: 4,
    title: '如何建立健康的恋爱关系',
    content: '健康的恋爱关系对个人的心理健康和幸福感有着重要影响。本文将介绍如何建立和维护健康的恋爱关系，包括有效沟通、相互尊重、共同成长等方面。通过这些建议，你可以建立更加健康、稳定的恋爱关系。',
    categoryId: 6,
    categoryName: '恋爱',
    authorName: '专家',
    status: 1,
    coverImage: '',
    readCount: 2345,
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04')
  },
  {
    id: 5,
    title: '婚姻中的沟通技巧',
    content: '良好的沟通是婚姻幸福的基石。本文将介绍婚姻中的有效沟通技巧，包括倾听技巧、表达技巧、冲突解决技巧等。通过这些技巧，你可以改善婚姻中的沟通质量，增强夫妻之间的理解和信任。',
    categoryId: 7,
    categoryName: '婚姻',
    authorName: '专家',
    status: 1,
    coverImage: '',
    readCount: 1890,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  },
  {
    id: 6,
    title: '亲子关系的建立与维护',
    content: '亲子关系对孩子的成长和发展有着深远的影响。本文将介绍如何建立和维护健康的亲子关系，包括高质量的陪伴、有效的沟通、适当的边界设置等。通过这些方法，你可以与孩子建立更加亲密、健康的关系。',
    categoryId: 8,
    categoryName: '亲子关系',
    authorName: '专家',
    status: 1,
    coverImage: '',
    readCount: 1678,
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06')
  },
  {
    id: 7,
    title: '冥想的好处与实践',
    content: '冥想是一种古老的修行方式，现代科学也证明了它对心理健康的积极影响。本文将介绍冥想的好处，如减轻压力、提高专注力、改善情绪等，以及如何开始实践冥想。通过定期冥想，你可以培养内心的平静与智慧。',
    categoryId: 2,
    categoryName: '焦虑',
    authorName: '专家',
    status: 1,
    coverImage: '',
    readCount: 1345,
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-07')
  },
  {
    id: 8,
    title: '社交焦虑的应对策略',
    content: '社交焦虑是一种常见的焦虑障碍，影响着许多人的日常生活。本文将介绍社交焦虑的症状、成因以及有效的应对策略，如暴露疗法、认知重构、社交技能训练等。通过这些方法，你可以逐渐克服社交焦虑，享受更加丰富的社交生活。',
    categoryId: 2,
    categoryName: '焦虑',
    authorName: '专家',
    status: 1,
    coverImage: '',
    readCount: 1789,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
  },
  {
    id: 9,
    title: '季节性抑郁的预防与治疗',
    content: '季节性抑郁是一种与季节变化相关的抑郁障碍，通常在秋冬季节发作。本文将介绍季节性抑郁的症状、成因以及预防和治疗方法，如光照疗法、药物治疗、心理治疗等。通过这些方法，你可以更好地应对季节性抑郁，保持全年的心理健康。',
    categoryId: 3,
    categoryName: '抑郁',
    authorName: '专家',
    status: 1,
    coverImage: '',
    readCount: 1123,
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-09')
  },
  {
    id: 10,
    title: '工作与生活的平衡',
    content: '在当今快节奏的社会中，工作与生活的平衡变得越来越重要。本文将介绍如何实现工作与生活的平衡，包括时间管理、设定边界、自我关怀等方面。通过这些方法，你可以在追求职业成功的同时，保持身心健康和个人生活的质量。',
    categoryId: 4,
    categoryName: '压力管理',
    authorName: '专家',
    status: 1,
    coverImage: '',
    readCount: 1987,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  }
];
  fs.writeFileSync(ARTICLES_FILE, JSON.stringify(initialArticles, null, 2));
}

// 强制重新生成数据文件，确保数据结构正确
const initialArticles = [
  {
    id: 1,
    title: '如何应对焦虑',
    content: '<p>焦虑是一种常见的情绪反应，适当的焦虑可以帮助我们应对挑战，但过度的焦虑会影响我们的生活质量。</p><div class="section"><h2>应对焦虑的方法</h2><p>1. <strong>深呼吸</strong>：通过深呼吸来缓解紧张情绪</p><p>2. <strong>冥想</strong>：每天进行10-15分钟的冥想练习</p><p>3. <strong>运动</strong>：适当的运动可以释放压力</p><p>4. <strong>认知重构</strong>：改变消极的思维模式</p><p>5. <strong>时间管理</strong>：合理安排时间，避免压力累积</p></div><p>通过这些方法，你可以更好地管理自己的情绪，提高生活质量。</p>',
    categoryId: 2,
    categoryName: '焦虑',
    authorName: '专家',
    status: 1,
    coverImage: '',
    readCount: 1234,
    tagArray: ['焦虑', '心理健康', '情绪管理'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 2,
    title: '抑郁症的早期症状',
    content: '<p>抑郁症是一种常见的心理障碍，早期识别和干预非常重要。本文将介绍抑郁症的早期症状，帮助你及时发现并寻求帮助。</p><div class="section"><h2>常见的早期症状</h2><p>1. <strong>持续的情绪低落</strong>：感到悲伤、空虚或绝望</p><p>2. <strong>兴趣减退</strong>：对以前喜欢的活动失去兴趣</p><p>3. <strong>睡眠障碍</strong>：失眠或过度睡眠</p><p>4. <strong>食欲变化</strong>：食欲减退或暴饮暴食</p><p>5. <strong>疲劳感</strong>：即使没有做什么也感到疲劳</p><p>6. <strong>注意力不集中</strong>：难以集中精力或做决定</p></div><p>如果你或身边的人出现这些症状，建议及时寻求专业帮助。</p>',
    categoryId: 3,
    categoryName: '抑郁',
    authorName: '专家',
    status: 1,
    coverImage: '',
    readCount: 987,
    tagArray: ['抑郁症', '心理健康', '早期症状'],
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  },
  {
    id: 3,
    title: '压力管理技巧',
    content: '<p>现代生活中，压力无处不在。学会有效的压力管理技巧对保持心理健康至关重要。</p><div class="section"><h2>实用的压力管理方法</h2><p>1. <strong>时间管理</strong>：制定合理的计划，优先处理重要任务</p><p>2. <strong>放松训练</strong>：学习渐进式肌肉放松或引导式想象</p><p>3. <strong>社交支持</strong>：与朋友和家人保持联系</p><p>4. <strong>健康生活方式</strong>：均衡饮食、充足睡眠、定期运动</p><p>5. <strong>设定边界</strong>：学会说"不"，避免过度承诺</p></div><p>通过这些方法，你可以更好地应对生活和工作中的压力，保持身心健康。</p>',
    categoryId: 4,
    categoryName: '压力管理',
    authorName: '专家',
    status: 1,
    coverImage: '',
    readCount: 1567,
    tagArray: ['压力管理', '心理健康', '生活方式'],
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03')
  },
  {
    id: 4,
    title: '如何建立健康的恋爱关系',
    content: '<p>健康的恋爱关系对个人的心理健康和幸福感有着重要影响。本文将介绍如何建立和维护健康的恋爱关系。</p><div class="section"><h2>建立健康恋爱关系的关键</h2><p>1. <strong>有效沟通</strong>：坦诚地表达自己的感受和需求</p><p>2. <strong>相互尊重</strong>：尊重对方的意见、感受和边界</p><p>3. <strong>共同成长</strong>：支持对方的个人发展</p><p>4. <strong>信任</strong>：建立相互信任的关系</p><p>5. <strong>冲突解决</strong>：学会建设性地解决冲突</p></div><p>通过这些建议，你可以建立更加健康、稳定的恋爱关系。</p>',
    categoryId: 6,
    categoryName: '恋爱',
    authorName: '专家',
    status: 1,
    coverImage: '',
    readCount: 2345,
    tagArray: ['恋爱', '关系', '沟通'],
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04')
  },
  {
    id: 5,
    title: '婚姻中的沟通技巧',
    content: '<p>良好的沟通是婚姻幸福的基石。本文将介绍婚姻中的有效沟通技巧。</p><div class="section"><h2>婚姻沟通技巧</h2><p>1. <strong>倾听技巧</strong>：认真倾听对方的意见，不打断</p><p>2. <strong>表达技巧</strong>：使用"我"语句表达感受，避免指责</p><p>3. <strong>非语言沟通</strong>：注意肢体语言和面部表情</p><p>4. <strong>冲突解决</strong>：寻找双赢的解决方案</p><p>5. <strong>定期沟通</strong>：安排专门的时间进行深度交流</p></div><p>通过这些技巧，你可以改善婚姻中的沟通质量，增强夫妻之间的理解和信任。</p>',
    categoryId: 7,
    categoryName: '婚姻',
    authorName: '专家',
    status: 1,
    coverImage: '',
    readCount: 1890,
    tagArray: ['婚姻', '沟通', '关系'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  },
  {
    id: 6,
    title: '亲子关系的建立与维护',
    content: '<p>亲子关系对孩子的成长和发展有着深远的影响。本文将介绍如何建立和维护健康的亲子关系。</p><div class="section"><h2>建立健康亲子关系的方法</h2><p>1. <strong>高质量的陪伴</strong>：专注于与孩子的互动</p><p>2. <strong>有效的沟通</strong>：倾听孩子的想法和感受</p><p>3. <strong>适当的边界设置</strong>：建立明确的规则和期望</p><p>4. <strong>正面激励</strong>：表扬和鼓励孩子的积极行为</p><p>5. <strong>榜样作用</strong>：以身作则，展示正确的行为</p></div><p>通过这些方法，你可以与孩子建立更加亲密、健康的关系。</p>',
    categoryId: 8,
    categoryName: '亲子关系',
    authorName: '专家',
    status: 1,
    coverImage: '',
    readCount: 1678,
    tagArray: ['亲子关系', '家庭教育', '沟通'],
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06')
  },
  {
    id: 7,
    title: '冥想的好处与实践',
    content: '<p>冥想是一种古老的修行方式，现代科学也证明了它对心理健康的积极影响。</p><div class="section"><h2>冥想的好处</h2><p>1. <strong>减轻压力</strong>：降低 cortisol 水平</p><p>2. <strong>提高专注力</strong>：增强注意力和认知能力</p><p>3. <strong>改善情绪</strong>：减少焦虑和抑郁症状</p><p>4. <strong>促进睡眠</strong>：改善睡眠质量</p><p>5. <strong>增强自我意识</strong>：更好地了解自己</p></div><div class="section"><h2>开始实践冥想</h2><p>1. 找一个安静的地方</p><p>2. 选择一个舒适的坐姿</p><p>3. 设定一个时间（从5分钟开始）</p><p>4. 关注你的呼吸</p><p>5. 当思绪飘走时，温和地将注意力拉回呼吸</p></div><p>通过定期冥想，你可以培养内心的平静与智慧。</p>',
    categoryId: 2,
    categoryName: '焦虑',
    authorName: '专家',
    status: 1,
    coverImage: '',
    readCount: 1345,
    tagArray: ['冥想', '心理健康', '压力管理'],
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-07')
  },
  {
    id: 8,
    title: '社交焦虑的应对策略',
    content: '<p>社交焦虑是一种常见的焦虑障碍，影响着许多人的日常生活。本文将介绍社交焦虑的症状、成因以及有效的应对策略。</p><div class="section"><h2>社交焦虑的症状</h2><p>1. 对社交场合感到过度紧张和恐惧</p><p>2. 担心被他人评价或judge</p><p>3. 避免社交活动</p><p>4. 在社交场合出现身体症状（出汗、颤抖、心跳加速）</p></div><div class="section"><h2>应对策略</h2><p>1. <strong>暴露疗法</strong>：逐渐面对恐惧的社交场合</p><p>2. <strong>认知重构</strong>：挑战消极的思维模式</p><p>3. <strong>社交技能训练</strong>：学习有效的社交技巧</p><p>4. <strong>放松训练</strong>：使用深呼吸和渐进式肌肉放松</p><p>5. <strong>寻求专业帮助</strong>：考虑心理咨询或治疗</p></div><p>通过这些方法，你可以逐渐克服社交焦虑，享受更加丰富的社交生活。</p>',
    categoryId: 2,
    categoryName: '焦虑',
    authorName: '专家',
    status: 1,
    coverImage: '',
    readCount: 1789,
    tagArray: ['社交焦虑', '焦虑', '心理健康'],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
  },
  {
    id: 9,
    title: '季节性抑郁的预防与治疗',
    content: '<p>季节性抑郁是一种与季节变化相关的抑郁障碍，通常在秋冬季节发作。本文将介绍季节性抑郁的症状、成因以及预防和治疗方法。</p><div class="section"><h2>季节性抑郁的症状</h2><p>1. 情绪低落</p><p>2. 疲劳感</p><p>3. 食欲增加，尤其是对碳水化合物的渴望</p><p>4. 睡眠增加</p><p>5. 社交退缩</p></div><div class="section"><h2>预防和治疗方法</h2><p>1. <strong>光照疗法</strong>：使用特殊的光疗灯</p><p>2. <strong>药物治疗</strong>：在医生的指导下使用抗抑郁药</p><p>3. <strong>心理治疗</strong>：认知行为疗法</p><p>4. <strong>生活方式调整</strong>：保持规律的作息，增加户外活动</p><p>5. <strong>社交支持</strong>：与朋友和家人保持联系</p></div><p>通过这些方法，你可以更好地应对季节性抑郁，保持全年的心理健康。</p>',
    categoryId: 3,
    categoryName: '抑郁',
    authorName: '专家',
    status: 1,
    coverImage: '',
    readCount: 1123,
    tagArray: ['季节性抑郁', '抑郁', '心理健康'],
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-09')
  },
  {
    id: 10,
    title: '工作与生活的平衡',
    content: '<p>在当今快节奏的社会中，工作与生活的平衡变得越来越重要。本文将介绍如何实现工作与生活的平衡。</p><div class="section"><h2>实现工作与生活平衡的方法</h2><p>1. <strong>时间管理</strong>：制定明确的工作和个人时间</p><p>2. <strong>设定边界</strong>：避免工作时间侵入个人生活</p><p>3. <strong>自我关怀</strong>：定期给自己充电，做喜欢的事情</p><p>4. <strong>优先级排序</strong>：确定什么对自己最重要</p><p>5. <strong>学会说"不"</strong>：避免过度承诺</p></div><div class="section"><h2>实际建议</h2><p>1. 设定固定的工作时间，避免加班</p><p>2. 利用午休时间放松，不要工作</p><p>3. 周末专注于个人生活，避免工作相关活动</p><p>4. 定期进行体育锻炼，保持身体健康</p><p>5. 与家人和朋友保持定期联系</p></div><p>通过这些方法，你可以在追求职业成功的同时，保持身心健康和个人生活的质量。</p>',
    categoryId: 4,
    categoryName: '压力管理',
    authorName: '专家',
    status: 1,
    coverImage: '',
    readCount: 1987,
    tagArray: ['工作生活平衡', '压力管理', '生活方式'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  }
];
fs.writeFileSync(ARTICLES_FILE, JSON.stringify(initialArticles, null, 2));

// 加载文章数据
const loadArticles = () => {
  const data = fs.readFileSync(ARTICLES_FILE, 'utf8');
  return JSON.parse(data);
};

// 保存文章数据
const saveArticles = (articles) => {
  fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2));
};

// 模拟文章数据
let articles = loadArticles();

const articleController = {
  // 获取文章分类树
  getCategoryTree: async (req, res) => {
    try {
      // 这里简化处理，返回模拟数据
      const categories = [
        {
          id: 1,
          name: '心理健康',
          children: [
            { id: 2, name: '焦虑' },
            { id: 3, name: '抑郁' },
            { id: 4, name: '压力管理' }
          ]
        },
        {
          id: 5,
          name: '情感关系',
          children: [
            { id: 6, name: '恋爱' },
            { id: 7, name: '婚姻' },
            { id: 8, name: '亲子关系' }
          ]
        }
      ];
      
      res.status(200).json({ code: 200, data: categories });
    } catch (error) {
      console.error('获取分类树失败:', error);
      res.status(500).json({ code: 500, message: '获取分类树失败' });
    }
  },
  
  // 获取文章列表
  getArticleList: async (req, res) => {
    try {
      const { sortField = 'published', sortDirection = 'desc', currentPage = req.query.page || 1, size = req.query.pageSize || 10, categoryId, status, title } = req.query;
      
      let filteredArticles = articles;
      if (categoryId) filteredArticles = filteredArticles.filter(article => article.categoryId == categoryId);
      if (status) filteredArticles = filteredArticles.filter(article => article.status == status);
      if (title) filteredArticles = filteredArticles.filter(article => article.title.toLowerCase().includes(title.toLowerCase()));
      
      // 排序
      filteredArticles.sort((a, b) => {
        let aValue, bValue;
        if (sortField === 'readCound') {
          aValue = a.readCount || 0;
          bValue = b.readCount || 0;
        } else if (sortField === 'published') {
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
        } else {
          aValue = a[sortField] || '';
          bValue = b[sortField] || '';
        }
        
        if (aValue < bValue) return sortDirection === 'desc' ? 1 : -1;
        if (aValue > bValue) return sortDirection === 'desc' ? -1 : 1;
        return 0;

      });
      
      const total = filteredArticles.length;
      const startIndex = (currentPage - 1) * size;
      const endIndex = startIndex + Number(size);
      const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
      
      res.status(200).json({
        code: 200,
        data: {
          list: paginatedArticles,
          pagination: {
            total,
            page: Number(currentPage),
            pageSize: Number(size)
          }
        }
      });
    } catch (error) {
      console.error('获取文章列表失败:', error);
      res.status(500).json({ code: 500, message: '获取文章列表失败' });
    }
  },
  
  // 创建文章
  createArticle: async (req, res) => {
    try {
      const { title, content, categoryId, status, cover } = req.body;
      
      const newArticle = {
        id: articles.length + 1,
        title,
        content,
        categoryId,
        status,
        cover,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      articles.push(newArticle);
      saveArticles(articles); // 保存到文件
      
      res.status(200).json({ code: 200, message: '创建文章成功' });
    } catch (error) {
      console.error('创建文章失败:', error);
      res.status(500).json({ code: 500, message: '创建文章失败' });
    }
  },
  
  // 获取文章详情
  getArticleDetail: async (req, res) => {
    try {
      const { id } = req.params;
      
      const article = articles.find(article => article.id == id);
      if (!article) {
        return res.status(404).json({ code: 404, message: '文章不存在' });
      }
      
      res.status(200).json({ code: 200, data: article });
    } catch (error) {
      console.error('获取文章详情失败:', error);
      res.status(500).json({ code: 500, message: '获取文章详情失败' });
    }
  },
  
  // 更新文章
  updateArticle: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content, categoryId, status, cover } = req.body;
      
      const articleIndex = articles.findIndex(article => article.id == id);
      if (articleIndex === -1) {
        return res.status(404).json({ code: 404, message: '文章不存在' });
      }
      
      articles[articleIndex] = {
        ...articles[articleIndex],
        title,
        content,
        categoryId,
        status,
        cover,
        updatedAt: new Date()
      };
      saveArticles(articles); // 保存到文件
      
      res.status(200).json({ code: 200, message: '更新文章成功' });
    } catch (error) {
      console.error('更新文章失败:', error);
      res.status(500).json({ code: 500, message: '更新文章失败' });
    }
  },
  
  // 更新文章状态
  updateArticleStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const articleIndex = articles.findIndex(article => article.id == id);
      if (articleIndex === -1) {
        return res.status(404).json({ code: 404, message: '文章不存在' });
      }
      
      articles[articleIndex] = {
        ...articles[articleIndex],
        status,
        updatedAt: new Date()
      };
      saveArticles(articles); // 保存到文件
      
      res.status(200).json({ code: 200, message: '更新状态成功' });
    } catch (error) {
      console.error('更新状态失败:', error);
      res.status(500).json({ code: 500, message: '更新状态失败' });
    }
  },
  
  // 删除文章
  deleteArticle: async (req, res) => {
    try {
      const { id } = req.params;
      
      const articleIndex = articles.findIndex(article => article.id == id);
      if (articleIndex === -1) {
        return res.status(404).json({ code: 404, message: '文章不存在' });
      }
      
      articles.splice(articleIndex, 1);
      saveArticles(articles); // 保存到文件
      
      res.status(200).json({ code: 200, message: '删除文章成功' });
    } catch (error) {
      console.error('删除文章失败:', error);
      res.status(500).json({ code: 500, message: '删除文章失败' });
    }
  }
};

module.exports = articleController;