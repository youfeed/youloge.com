import { ref } from 'vue'

/**
 * 邮件解析 Composable - 基于专业EML解析库模式重写
 */

/**
 * 解码RFC 2047编码的邮件头
 * @param {string} value 邮件头值
 * @returns {string} 解码后的值
 */
const decodeHeaderValue = (value) => {
  if (!value) return ''

  return value.replace(/=\?([^?]+)\?([BQbq])\?([^?]+)\?=/gi, (match, charset, encoding, encodedText) => {
    try {
      if (encoding.toUpperCase() === 'B') {
        const bytes = Uint8Array.from(atob(encodedText), c => c.charCodeAt(0))
        return new TextDecoder('utf-8').decode(bytes)
      } else if (encoding.toUpperCase() === 'Q') {
        return decodeURIComponent(encodedText.replace(/_/g, '%20').replace(/=([0-9A-F]{2})/gi, (_, hex) => `%${hex}`))
      }
    } catch (e) {
      console.warn('邮件头解码失败:', e)
    }
    return match
  })
}

/**
 * 解码内容根据传输编码
 * @param {string} content 原始内容
 * @param {string} encoding 传输编码
 * @returns {string} 解码后的内容
 */
const decodeContent = (content, encoding) => {
  if (!encoding) return content

  const enc = encoding.toLowerCase()
  if (enc === 'base64') {
    try {
      // 移除所有空白字符后解码
      const cleanContent = content.replace(/\s/g, '')
      const bytes = Uint8Array.from(atob(cleanContent), c => c.charCodeAt(0))
      return new TextDecoder('utf-8').decode(bytes)
    } catch (e) {
      console.warn('Base64解码失败:', e)
      return content
    }
  } else if (enc === 'quoted-printable') {
    return content
      .replace(/=\r?\n/g, '') // 移除软换行
      .replace(/=([0-9A-F]{2})/gi, (match, hex) => String.fromCharCode(parseInt(hex, 16)))
  }

  return content
}

/**
 * 清理和标准化邮箱地址
 * @param {string} address 邮件地址
 * @returns {string} 清理后的邮箱地址
 */
const cleanEmailAddress = (address) => {
  if (!address) return ''

  // 先解码
  address = decodeHeaderValue(address)

  // 提取邮箱地址
  const emailMatch = address.match(/<([^>]+)>/)
  if (emailMatch) {
    return emailMatch[1]
  }

  // 直接匹配邮箱格式
  const directMatch = address.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/)
  if (directMatch) {
    return directMatch[0]
  }

  return address.trim()
}

/**
 * 解析MIME部分
 * @param {string} partContent MIME部分内容
 * @returns {object} 解析结果
 */
const parseMimePart = (partContent) => {
  const lines = partContent.split('\n')
  const partHeaders = {}
  let partBodyStart = 0
  let currentHeader = ''

  // 解析部分头部
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (line === '') {
      partBodyStart = i + 1
      break
    }

    if (line.match(/^[A-Za-z-]+:/)) {
      const colonIndex = line.indexOf(':')
      const key = line.substring(0, colonIndex).toLowerCase().trim()
      const value = line.substring(colonIndex + 1).trim()
      partHeaders[key] = value
      currentHeader = key
    } else if (line.match(/^\s+/) && currentHeader) {
      partHeaders[currentHeader] += ' ' + line.trim()
    }
  }

  const partBody = lines.slice(partBodyStart).join('\n').trim()
  const contentType = partHeaders['content-type'] || ''
  const contentTransferEncoding = partHeaders['content-transfer-encoding'] || ''

  // 检查是否为附件
  const isAttachment = partHeaders['content-disposition']?.toLowerCase().includes('attachment')

  if (isAttachment) {
    return { isAttachment: true }
  } else {
    // 文本内容
    const decodedContent = decodeContent(partBody, contentTransferEncoding)
    return {
      content: decodedContent,
      contentType: contentType.split(';')[0].trim(),
      isAttachment: false
    }
  }
}

/**
 * 解析MIME多部分内容
 * @param {string} body 邮件正文
 * @param {string} contentType Content-Type头
 * @returns {object} 解析结果
 */
const parseMultipart = (body, contentType) => {
  const result = { plain: '', html: '' }
  
  const boundaryMatch = contentType.match(/boundary=([^;\s]+)/i)
  if (!boundaryMatch) return result

  const boundary = boundaryMatch[1].replace(/['"]/g, '')

  // 分割MIME部分
  const parts = body.split(new RegExp(`--${boundary.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'))

  parts.forEach(part => {
    part = part.trim()
    if (!part || part === '--' || part.startsWith('--')) return

    const partResult = parseMimePart(part)
    if (partResult && !partResult.isAttachment) {
      if (partResult.contentType?.toLowerCase().includes('text/html')) {
        result.html = partResult.content
      } else if (partResult.contentType?.toLowerCase().includes('text/plain')) {
        result.plain = partResult.content
      }
    }
  })

  return result
}

/**
 * Composables：邮件解析工具
 */
export const useMailParser = () => {
  const mailInfo = ref({
    from: '',        // 发件人
    to: '',          // 收件人
    subject: '',     // 主题
    date: '',        // 发送日期
    plain: '',       // 纯文本正文
    html: '',        // HTML正文
    raw: '',         // 原始文本
    error: ''        // 错误信息
  })

  /**
   * 核心解析方法
   * @param {string} rawMail 原始邮件文本
   */
  const parseMail = (rawMail) => {
    try {
      mailInfo.value.error = ''
      
      if (!rawMail) {
        mailInfo.value = { ...mailInfo.value, from: '', to: '', subject: '', date: '', plain: '', html: '', raw: '' }
        return
      }

      console.log('开始解析邮件...')

      // 步骤1：分割行并解析邮件头
      const lines = rawMail.split(/\r?\n/)
      const headers = {}
      let bodyStart = 0
      let currentHeader = ''

      // 解析邮件头（支持多行）
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]

        if (line.trim() === '') {
          bodyStart = i + 1
          break
        }

        if (line.match(/^[A-Za-z-]+:/)) {
          const colonIndex = line.indexOf(':')
          const key = line.substring(0, colonIndex).toLowerCase().trim()
          const value = line.substring(colonIndex + 1).trim()
          headers[key] = value
          currentHeader = key
        } else if (line.match(/^\s+/) && currentHeader) {
          // 续行处理
          headers[currentHeader] += ' ' + line.trim()
        }
      }

      console.log('邮件头解析完成:', headers)

      // 步骤2：提取关键信息
      const from = cleanEmailAddress(headers.from)
      const to = cleanEmailAddress(headers.to)
      const subject = decodeHeaderValue(headers.subject)
      let date = headers.date || ''
      
      try {
        date = new Date(date).toLocaleString()
      } catch (e) {
        console.warn('日期解析失败:', e)
      }

      // 步骤3：解析正文
      const body = lines.slice(bodyStart).join('\n')
      const contentType = headers['content-type'] || ''
      
      let plain = '', html = ''

      if (contentType.toLowerCase().includes('multipart')) {
        const result = parseMultipart(body, contentType)
        plain = result.plain
        html = result.html
      } else {
        // 单部分邮件
        const encoding = headers['content-transfer-encoding'] || ''
        const decodedBody = decodeContent(body, encoding)

        if (contentType.toLowerCase().includes('text/html')) {
          html = decodedBody
        } else {
          plain = decodedBody
        }
      }

      console.log('邮件解析结果:', { from, to, subject, date, hasPlain: !!plain, hasHTML: !!html })

      // 步骤4：更新响应式数据
      mailInfo.value = {
        ...mailInfo.value,
        from,
        to,
        subject,
        date,
        plain,
        html,
        raw: rawMail
      }

    } catch (e) {
      mailInfo.value.error = `解析失败：${e.message}`
      console.error('邮件解析异常:', e)
    }
  }

  /**
   * 下载并解析邮件
   * @param {string} url 邮件下载接口地址
   */
  const fetchAndParseMail = async (url) => {
    try {
      mailInfo.value.error = ''
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`请求失败：${response.status} ${response.statusText}`)
      }
      const rawMail = await response.text()
      parseMail(rawMail)
    } catch (e) {
      mailInfo.value.error = `下载/解析失败：${e.message}`
      console.error('邮件下载异常:', e)
    }
  }

  return {
    mailInfo,
    parseMail,
    fetchAndParseMail
  }
}