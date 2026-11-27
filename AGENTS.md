# AGENTS.md — 开发约束

本文件用于约束 AI 在本仓库内编写、修改代码时的行为与风格。修改代码前请先通读。

## 项目概况

- 技术栈：Vue 3（`<script setup>` 组合式 API）+ Vue Router + Tailwind CSS v4 + Vite 构建。

## 自动导入约定（重要）

本项目开启 `unplugin-auto-import` 与 `unplugin-vue-components`，以下内容**禁止手动 import**，直接用即可（类型声明见 `src/auto-imports.d.ts` 与 `src/auto-components.d.ts`）：

- Vue API：`ref` / `reactive` / `computed` / `watch` / `onMounted` / `onUnmounted` / `nextTick` 等。
- 路由：`useRouter` / `useRoute`。
- 全局函数：`apiFetch`（HTTP）、`useImage`（CDN 图片地址）、`useMessage`（toast）、`useHead`（SEO）、`useFiles`（上传）、`useAccount`、`YouPlus` 等（来自 `src/composables/`）。
- Store：`storeProfile()`、`storeDraft()`（来自 `src/stores/`）， 使用时统一用`const stateProfile = storeProfile()`。
- 业务组件：`YouDiscuss`、`YouEditor`、`YouLoading`、`YouMessage`、`GoogleAd` 等，模板中直接用 PascalCase，无需 import。

## 代码风格

- 缩进：4 空格，不使用 Tab。
- 语句末尾加分号；字符串统一使用单引号。
- 注释使用中文；函数/组件头部写清职责；复杂逻辑加行内注释。
- 文件末尾保留一个空行；不引入与任务无关的空行改动。

## Vue 组件约束

- 一律使用 `<script setup>` 组合式 API，不写 Options API。
- 参数声明统一使用 `const state = reactive({})` 模式,页面用的变量解构出来 `const {x,y} = toRefs(state)`。
- 样式统一使用 Tailwind 工具类；确实需要自定义样式时用 `<style scoped>` 最小化补充。
- 页面级组件放 `src/views/`，通用组件放 `src/components/`；本地私有逻辑可放 `src/composables/`。
- 模板中避免内联复杂表达式，抽成函数或 computed。

## 后端接口与数据约定

- 所有请求统一走 `apiFetch(path, params)`，不做裸 `fetch` 业务调用（正文内容拉取除外）。
- 图片展示：`useImage(key, size=80)` 生成 CDN 地址，禁止直接拼 URL。`size=0|1|80|150|300|169`

## 路由约定

- 页面级 SEO 用 `useHead` 设置 title/meta；注意 `og:url` 等链接必须与当前短链路由保持一致。

## 质量与协作纪律

- 只修改任务涉及的文件，避免顺手大范围重构；删除/改写他人大段代码前先说明必要性。

