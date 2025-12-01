<template>
  <div class="example-container">
    <h2>Base32 验证码键盘输入示例</h2>
    
    <div class="code-section">
      <h3>期望验证码: {{ expectedCode }}</h3>
      <p>请使用虚拟键盘输入验证码</p>
      
      <VirtualKeyboard 
        :expected-code="expectedCode"
        :length="codeLength"
        @verified="handleVerification"
        @code-changed="handleCodeChange"
      />
      
      <div v-if="verificationResult" class="result">
        <h4>验证结果:</h4>
        <p :class="{ 'success': verificationResult.valid, 'error': !verificationResult.valid }">
          {{ verificationResult.valid ? '验证成功!' : '验证失败' }}
        </p>
        <div v-if="verificationResult.decoded">
          <p>输入的Base32码: {{ verificationResult.code }}</p>
          <p>解码后内容: {{ verificationResult.decoded }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import VirtualKeyboard from '../components/VirtualKeyboard.vue';

// 生成一个示例Base32验证码
const generateBase32Code = () => {
  const text = 'hello'; // 要编码的文本
  const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  
  let bits = '';
  for (let i = 0; i < text.length; i++) {
    const binary = text.charCodeAt(i).toString(2).padStart(8, '0');
    bits += binary;
  }
  
  // 转换为Base32
  let encoded = '';
  for (let i = 0; i < bits.length; i += 5) {
    if (i + 5 <= bits.length) {
      const chunk = bits.substring(i, i + 5);
      const index = parseInt(chunk, 2);
      encoded += base32Chars[index];
    }
  }
  
  return encoded;
};

const expectedCode = ref(generateBase32Code());
const codeLength = ref(8);
const verificationResult = ref(null);

const handleVerification = (result) => {
  verificationResult.value = result;
  console.log('验证结果:', result);
};

const handleCodeChange = (code) => {
  console.log('用户输入:', code);
};
</script>

<style scoped>
.example-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

h2 {
  color: #24292e;
  text-align: center;
  margin-bottom: 30px;
}

.code-section {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

h3 {
  color: #24292e;
  margin-bottom: 10px;
}

p {
  color: #586069;
  margin-bottom: 15px;
}

.result {
  margin-top: 20px;
  padding: 15px;
  border-radius: 6px;
  background-color: #fff;
  border: 1px solid #e1e4e8;
}

.success {
  color: #1a7f37;
  font-weight: bold;
}

.error {
  color: #d1242f;
  font-weight: bold;
}
</style>