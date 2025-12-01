# VirtualKeyboard 组件

一个用于虚拟键盘输入 Base32 验证码的函数式组件。

## 功能特点

- 虚拟键盘输入，支持字母和数字
- Base32 编码验证
- 可视化输入进度
- 错误提示和验证反馈
- 完全响应式设计

## 使用方法

```vue
<template>
  <VirtualKeyboard 
    :expected-code="expectedBase32Code"
    :length="8"
    @verified="handleVerification"
    @code-changed="handleCodeChange"
  />
</template>

<script setup>
import VirtualKeyboard from '@/components/VirtualKeyboard.vue';

const expectedBase32Code = ref('NB2W4=');
const handleVerification = (result) => {
  if (result.valid) {
    console.log('验证成功:', result.decoded);
  } else {
    console.log('验证失败:', result.error);
  }
};

const handleCodeChange = (code) => {
  console.log('当前输入:', code);
};
</script>
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
| ------- | ---- | ------- | ---- |
| expectedCode | String | '' | 期望的 Base32 验证码 |
| length | Number | 8 | 验证码长度 |

## Events

| 事件名 | 参数 | 说明 |
| ------ | ---- | ---- |
| verified | { code, decoded, valid, error? } | 用户点击验证按钮时触发 |
| codeChanged | String | 用户输入发生变化时触发 |

## Base32 编码说明

组件使用 RFC 4648 标准的 Base32 字符集：
```
ABCDEFGHIJKLMNOPQRSTUVWXYZ234567
```

## 样式自定义

组件使用以下 CSS 类，可以通过覆盖这些类来自定义样式：

- `.virtual-keyboard`: 组件根容器
- `.keyboard-display`: 验证码显示区域
- `.code-display`: 验证码字符显示
- `.code-char`: 单个字符样式
- `.keyboard-grid`: 键盘网格
- `.keyboard-row`: 键盘行
- `.key-button`: 通用按键样式
- `.number-key`: 数字键样式
- `.letter-key`: 字母键样式
- `.function-key`: 功能键样式
- `.error-message`: 错误信息样式