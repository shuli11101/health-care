/**
 * 调用百度大模型生成回复
 * @param {string} prompt 用户输入的问题
 * @returns {Promise<string>} 大模型生成的回复
 */
export async function generateResponse(prompt) {
  try {
    // 百度大模型API配置
    const API_KEY = process.env.BAIDU_API_KEY;
    const API_URL = 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions';
    
    // 构建请求参数
    const requestData = {
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      top_p: 0.95
    };
    
    // 发送请求
    const response = await fetch(`${API_URL}?access_token=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    
    const data = await response.json();
    console.log('AI生成结果:', data);
    
    if (data.error_code) {
      throw new Error(data.error_msg || 'API调用失败');
    }
    
    return data.result || '抱歉，我暂时无法回答你的问题，请稍后再试。';
  } catch (error) {
    console.error('AI生成失败:', error);
    return '抱歉，我暂时无法回答你的问题，请稍后再试。';
  }
}

/**
 * 分析文本情感
 * @param {string} text 需要分析的文本
 * @returns {Promise<Object>} 情感分析结果
 */
export async function analyzeSentiment(text) {
  try {
    // 简单的情感分析实现
    const positiveWords = ['开心', '快乐', '高兴', '兴奋', '满足', '幸福', '喜欢', '爱', '好', '棒'];
    const negativeWords = ['难过', '伤心', '痛苦', '生气', '愤怒', '失望', '讨厌', '恨', '坏', '糟'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      if (text.includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
      if (text.includes(word)) negativeCount++;
    });
    
    let sentiment = 1; // 中性
    if (positiveCount > negativeCount) sentiment = 2; // 正面
    if (negativeCount > positiveCount) sentiment = 0; // 负面
    
    return {
      items: [{
        sentiment,
        confidence: Math.max(0.5, Math.min(1, (Math.abs(positiveCount - negativeCount) + 1) / (positiveCount + negativeCount + 2)))
      }]
    };
  } catch (error) {
    console.error('情感分析失败:', error);
    throw error;
  }
}
