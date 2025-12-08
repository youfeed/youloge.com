import { ref } from 'vue'

/**
 * 邮件解析 Composable
 * 功能：解析邮件原始正文，提取纯文本和HTML内容
 */

/**
 * 解码邮件头中的编码字符串（如 =?utf-8?B?WW91bG9nZQ==?=）
 * @param {string} str 待解码的字符串
 * @returns {string} 解码后的字符串
 */
const decodeHeader = (str) => {
  if (!str) return '';
  
  // 匹配 =?charset?B/Q?content?= 格式
  const match = str.match(/=\?([\w-]+)\?(B|Q)\?([^\?]+)\?=/i);
  if (!match) return str;
  
  const [, charset, encoding, content] = match;
  
  try {
    if (encoding.toUpperCase() === 'B') {
      // Base64 解码
      return decodeURIComponent(escape(atob(content)));
    } else if (encoding.toUpperCase() === 'Q') {
      // Quoted-Printable 解码
      return decodeURIComponent(content.replace(/_/g, ' ').replace(/=([0-9A-F]{2})/gi, (_, hex) => `%${hex}`));
    }
  } catch (e) {
    console.warn('邮件头解码失败:', e);
  }
  
  return content;
};

/**
 * 提取邮件正文内容
 * @param {string} rawMail 原始邮件文本
 * @returns {object} 包含纯文本和HTML内容的对象
 */
const extractBodyContent = (rawMail) => {
  if (!rawMail) return { plain: '', html: '' };
  
  const result = { plain: '', html: '' };
  
  // 查找邮件内容边界
  const bodyMatch = rawMail.match(/\r?\n\r?\n([\s\S]*)/);
  if (!bodyMatch) return result;
  
  const body = bodyMatch[1];
  
  // 检查是否为MIME格式
  const boundaryMatch = rawMail.match(/boundary="([^"]+)"/i);
  
  if (boundaryMatch) {
    // MIME多部分邮件处理
    const boundary = boundaryMatch[1];
    const parts = body.split(`--${boundary}`).filter(part => part.trim());
    
    parts.forEach(part => {
      const contentTypeMatch = part.match(/content-type:\s*text\/(\w+)/i);
      const encodingMatch = part.match(/content-transfer-encoding:\s*(\w+)/i);
      
      if (!contentTypeMatch) return;
      
      const contentType = contentTypeMatch[1].toLowerCase();
      const encoding = encodingMatch?.[1]?.toLowerCase();
      
      // 提取实际内容（跳过空行和头部）
      const contentMatch = part.match(/\r?\n\r?\n([\s\S]*)/);
      const content = contentMatch ? contentMatch[1].trim() : '';
      
      // 根据编码解码
      let decodedContent = content;
      if (encoding === 'base64') {
        try {
          decodedContent = decodeURIComponent(escape(atob(content)));
        } catch (e) {
          console.warn('Base64解码失败:', e);
        }
      }
      
      // 存储到结果对象
      if (contentType === 'plain') {
        result.plain = decodedContent;
      } else if (contentType === 'html') {
        result.html = decodedContent;
      }
    });
  } else {
    // 简单文本邮件处理
    const encodingMatch = rawMail.match(/content-transfer-encoding:\s*(\w+)/i);
    const encoding = encodingMatch?.[1]?.toLowerCase();
    
    let decodedContent = body;
    if (encoding === 'base64') {
      try {
        decodedContent = decodeURIComponent(escape(atob(body)));
      } catch (e) {
        console.warn('Base64解码失败:', e);
      }
    }
    
    // 默认为纯文本
    result.plain = decodedContent;
    
    // 如果内容包含HTML标签，也存储到html字段
    if (/<[a-z][\s\S]*>/i.test(decodedContent)) {
      result.html = decodedContent;
    }
  }
  
  return result;
};

/**
 * 解析邮件基本信息
 * @param {string} rawMail 原始邮件文本
 * @returns {object} 邮件头信息
 */
const parseHeaders = (rawMail) => {
  const lines = rawMail.split('\n');
  const headers = {
    from: '',
    to: '',
    subject: '',
    date: ''
  };
  
  lines.forEach(line => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;
    
    if (trimmedLine.toLowerCase().startsWith('from:')) {
      headers.from = decodeHeader(trimmedLine.replace(/^from:\s*/i, ''));
    } else if (trimmedLine.toLowerCase().startsWith('to:')) {
      headers.to = decodeHeader(trimmedLine.replace(/^to:\s*/i, ''));
    } else if (trimmedLine.toLowerCase().startsWith('subject:')) {
      headers.subject = decodeHeader(trimmedLine.replace(/^subject:\s*/i, ''));
    } else if (trimmedLine.toLowerCase().startsWith('date:')) {
      const dateStr = trimmedLine.replace(/^date:\s*/i, '');
      try {
        headers.date = new Date(dateStr).toLocaleString();
      } catch (e) {
        headers.date = dateStr; // 解析失败则使用原始字符串
      }
    }
  });
  
  return headers;
};

/**
 * 邮件解析 Composable
 * 功能：解析邮件正文，提取纯文本和HTML内容
 * @returns {object} 响应式邮件信息 + 解析方法
 */
export const useMailParser = () => {
  // 响应式存储解析后的邮件信息
  const mailInfo = ref({
    from: '',
    to: '',
    subject: '',
    date: '',
    plainText: '',
    htmlText: '',
    raw: '',
    error: ''
  });
  
  /**
   * 解析邮件正文
   * @param {string} rawMail 原始邮件文本
   */
  const parseMail = (rawMail) => {
    try {
      mailInfo.value.error = '';
      
      if (!rawMail) {
        mailInfo.value = { ...mailInfo.value, plainText: '', htmlText: '', raw: '' };
        return;
      }
      
      // 解析邮件头
      const headers = parseHeaders(rawMail);
      
      // 提取正文内容
      const { plain, html } = extractBodyContent(rawMail);
      
      // 更新响应式数据
      mailInfo.value = {
        ...headers,
        plainText: plain,
        htmlText: html,
        raw: rawMail,
        error: ''
      };
    } catch (e) {
      mailInfo.value.error = `解析失败：${e.message}`;
      console.error('邮件解析异常:', e);
    }
  };
  
  return {
    mailInfo,  // 响应式邮件信息
    parseMail  // 解析邮件方法
  };
};