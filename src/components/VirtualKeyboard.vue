<template>
  <div class="virtual-keyboard">
    <div class="keyboard-display">
      <div class="display-container">
        <div class="code-display">
          <span 
            v-for="(char, index) in displayCode" 
            :key="index"
            class="code-char"
            :class="{ 'filled': char !== '_' }"
          >
            {{ char }}
          </span>
        </div>
      </div>
    </div>
    
    <div class="keyboard-grid">
      <!-- 第一行：数字键 -->
      <div class="keyboard-row">
        <button 
          v-for="key in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']" 
          :key="key"
          class="key-button number-key"
          @click="handleKeyPress(key)"
        >
          {{ key }}
        </button>
      </div>
      
      <!-- 第二行：字母键 A-Z -->
      <div class="keyboard-row">
        <button 
          v-for="key in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'" 
          :key="key"
          class="key-button letter-key"
          @click="handleKeyPress(key)"
        >
          {{ key }}
        </button>
      </div>
      
      <!-- 功能键 -->
      <div class="keyboard-row">
        <button 
          class="key-button function-key backspace"
          @click="handleBackspace"
        >
          ←
        </button>
        <button 
          class="key-button function-key clear"
          @click="handleClear"
        >
          清空
        </button>
        <button 
          class="key-button function-key verify"
          @click="handleVerify"
          :disabled="!isCodeComplete"
        >
          验证
        </button>
      </div>
    </div>
    
    <div v-if="showError" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  expectedCode: {
    type: String,
    default: ''
  },
  length: {
    type: Number,
    default: 8
  }
});

const emit = defineEmits(['verified', 'codeChanged']);

// 显示的验证码，用下划线填充未输入部分
const displayCode = ref([]);
const showError = ref(false);
const errorMessage = ref('');
const inputCode = ref('');

// 初始化显示码
const initDisplayCode = () => {
  displayCode.value = Array(props.length).fill('_');
};

initDisplayCode();

// 计算属性：验证码是否完整
const isCodeComplete = computed(() => {
  return inputCode.value.length === props.length;
});

// 处理按键输入
const handleKeyPress = (key) => {
  if (inputCode.value.length >= props.length) return;
  
  inputCode.value += key;
  updateDisplayCode();
};

// 处理退格键
const handleBackspace = () => {
  if (inputCode.value.length === 0) return;
  
  inputCode.value = inputCode.value.slice(0, -1);
  updateDisplayCode();
};

// 清空输入
const handleClear = () => {
  inputCode.value = '';
  updateDisplayCode();
  showError.value = false;
  errorMessage.value = '';
};

// 更新显示码
const updateDisplayCode = () => {
  const chars = inputCode.value.split('');
  const remaining = props.length - chars.length;
  
  // 更新显示数组
  displayCode.value = [...chars, ...Array(remaining).fill('_')];
  
  // 触发码变化事件
  emit('codeChanged', inputCode.value);
};

// Base32 验证
const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const base32Decode = (encoded) => {
  try {
    // 移除可能的填充字符
    const cleanEncoded = encoded.replace(/=/g, '');
    
    let bits = '';
    for (let i = 0; i < cleanEncoded.length; i++) {
      const val = base32Chars.indexOf(cleanEncoded[i]);
      if (val === -1) return null;
      
      const binary = val.toString(2).padStart(5, '0');
      bits += binary;
    }
    
    // 将二进制转换为字节
    const bytes = [];
    for (let i = 0; i < bits.length; i += 8) {
      if (i + 8 > bits.length) break;
      const byte = bits.substring(i, i + 8);
      bytes.push(parseInt(byte, 2));
    }
    
    // 转换为字符串
    let decoded = '';
    for (const byte of bytes) {
      decoded += String.fromCharCode(byte);
    }
    
    return decoded;
  } catch (error) {
    console.error('Base32 decode error:', error);
    return null;
  }
};

// 处理验证
const handleVerify = () => {
  if (!isCodeComplete.value) return;
  
  const decodedInput = base32Decode(inputCode.value);
  const decodedExpected = base32Decode(props.expectedCode);
  
  console.log('输入码:', inputCode.value);
  console.log('解码后输入:', decodedInput);
  console.log('期望码:', props.expectedCode);
  console.log('解码后期望:', decodedExpected);
  
  // 验证码是否匹配
  const isValid = decodedInput === decodedExpected;
  
  if (isValid) {
    showError.value = false;
    errorMessage.value = '';
    emit('verified', { 
      code: inputCode.value, 
      decoded: decodedInput,
      valid: true 
    });
  } else {
    showError.value = true;
    errorMessage.value = '验证码错误，请重新输入';
    emit('verified', { 
      code: inputCode.value, 
      decoded: decodedInput,
      valid: false,
      error: '验证码错误，请重新输入'
    });
    
    // 错误后清空，让用户重新输入
    setTimeout(() => {
      handleClear();
    }, 1500);
  }
};

// 监听期望码变化，重置显示
watch(() => props.expectedCode, () => {
  initDisplayCode();
  handleClear();
});

// 监听长度变化，重置显示
watch(() => props.length, () => {
  initDisplayCode();
  handleClear();
});
</script>

<style scoped>
.virtual-keyboard {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.keyboard-display {
  margin-bottom: 20px;
}

.display-container {
  background-color: #fff;
  border: 2px solid #e1e4e8;
  border-radius: 6px;
  padding: 15px;
  overflow: hidden;
}

.code-display {
  display: flex;
  justify-content: center;
  letter-spacing: 8px;
}

.code-char {
  font-size: 24px;
  font-weight: bold;
  width: 32px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-bottom: 2px solid #ddd;
  transition: all 0.2s;
}

.code-char.filled {
  border-bottom-color: #0969da;
  color: #0969da;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0.5;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.keyboard-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.keyboard-row {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.key-button {
  min-width: 45px;
  height: 45px;
  border: none;
  border-radius: 6px;
  background-color: #fff;
  border: 1px solid #d1d5da;
  color: #24292e;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.key-button:hover {
  background-color: #f6f8fa;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.key-button:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.number-key {
  background-color: #f6f8fa;
}

.letter-key {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-weight: bold;
}

.function-key {
  min-width: 80px;
  background-color: #f1f3f4;
  color: #656d76;
}

.function-key.backspace {
  background-color: #fffbeb;
  color: #d1242f;
}

.function-key.clear {
  background-color: #ffd1dc;
  color: #d1242f;
}

.function-key.verify {
  background-color: #1a7f37;
  color: #fff;
  font-weight: bold;
}

.key-button:disabled {
  background-color: #f1f3f4;
  color: #959da5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.error-message {
  margin-top: 10px;
  padding: 8px 12px;
  background-color: #ffebe9;
  border: 1px solid #d1242f;
  border-radius: 4px;
  color: #d1242f;
  text-align: center;
  animation: shake 0.5s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
</style>