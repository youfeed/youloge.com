<script setup>

const props = defineProps({
  type: { type: String, required: true, validator: (val) => ['notes', 'drive', 'goods', 'article', 'tweet'].includes(val) },
  uuid: { type: String, required: true },
  cursor: { type: String, default: '' }
})

const emit = defineEmits(['created'])

const state = reactive({
  data: [],
  loading: false,
  cursor: props.cursor || null,
  hasMore: false
})

// 评论框内容
const content = ref('')
// 提交中
const submitting = ref(false)

// 加载评论列表
const fetchList = async (append = false) => {
  if (state.loading) return
  state.loading = true
  try {
    const params = { root: 0, uuid: props.uuid }
    if (append && state.cursor) params.cursor = state.cursor

    const res = await apiFetch(`/discuss/${props.type}`, params)
    const list = res.data || []

    // 给每个评论初始化 replies 相关状态
    list.forEach(item => {
      item._repliesLoading = false
      item._repliesCursor = null
    })

    if (append) {
      state.data.push(...list)
    } else {
      state.data = list
    }
    state.cursor = res.next_cursor || null
    state.hasMore = !!res.next_cursor
  } catch (err) {
    useMessage().error('加载评论失败')
  } finally {
    state.loading = false
  }
}

// 加载全部回复
const loadAllReplies = async (comment) => {
  if (comment._repliesLoading) return
  comment._repliesLoading = true
  try {
    const params = { root: comment.uuid, uuid: props.uuid }
    if (comment._repliesCursor) params.cursor = comment._repliesCursor

    const res = await apiFetch(`/discuss/${props.type}`, params)
    const more = res.data || []

    comment.replies = [...(comment.replies || []), ...more]
    comment._repliesCursor = res.next_cursor || null
  } catch (err) {
    useMessage().error('加载回复失败')
  } finally {
    comment._repliesLoading = false
  }
}

// 加载更多评论
const loadMore = () => {
  if (!state.hasMore || state.loading) return
  fetchList(true)
}

// 是否还有更多回复未加载
const hasMoreReplies = (comment) => {
  const current = comment.replies?.length || 0
  const total = comment.repli || 0
  return current < total
}

// 剩余回复数
const remainingReplies = (comment) => {
  return (comment.repli || 0) - (comment.replies?.length || 0)
}

// 发表评论：POST /discuss/create
const submitComment = async () => {
  const text = content.value.trim()
  if (!text) {
    useMessage().warning('请输入评论内容')
    return
  }
  const profile = useAccount()
  if (!profile?.access_token) {
    useMessage().warning('请先登录后再评论')
    return
  }

  submitting.value = true
  try {
    const result = await apiFetch('/discuss/create', {
      type: props.type,
      uuid: props.uuid,
      content: text
    })

    // 兼容后端直接返回评论对象 / 包装在 data 字段 / 仅返回状态三种情况
    const newItem = (result && result.uuid)
      ? result
      : (result && result.data && result.data.uuid) ? result.data : null

    if (newItem) {
      newItem._repliesLoading = false
      newItem._repliesCursor = null
      state.data.unshift(newItem)
    } else {
      // 后端未返回详情，重新拉取列表
      await fetchList()
    }

    content.value = ''
    emit('created', newItem || {})
    useMessage().success('评论发表成功')
  } catch (err) {
    useMessage().error(err?.message || '评论发表失败')
  } finally {
    submitting.value = false
  }
}

fetchList()
</script>

<template>
  <div class="you-discuss bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
    <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
      <h2 class="text-base font-semibold text-slate-900 flex items-center gap-2">
        <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        留言评论
      </h2>
      <span class="text-xs text-slate-400"></span>
    </div>
    <!-- 加载中 -->
    <div v-if="state.loading && state.data.length === 0" class="flex items-center justify-center py-8">
      <svg class="animate-spin w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!state.loading && state.data.length === 0" class="text-center py-6 text-xs text-gray-400">
      <div class="py-12 text-center">
        <svg class="w-12 h-12 mx-auto text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p class="text-sm text-slate-400 mt-3">暂无留言，快来抢沙发</p>
      </div>
    </div>

    <!-- 评论列表 -->
    <div v-else class="px-6 py-5 space-y-5">
      <div v-for="(item, idx) in state.data" :key="item.uuid || idx" class="group">
        <!-- 主评论 -->
        <div class="flex gap-2.5">
          <!-- {{ item }} -->
          <img :src="useImage(item.account.avatar, 80)" :alt="item.name"
            class="w-7 h-7 rounded-full object-cover shrink-0 bg-gray-100" />
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs font-medium text-gray-800">{{ item.name }}</span>
              <span class="text-[11px] text-gray-400">{{ useTimeago(item.created) }}</span>
            </div>
            <p class="text-xs text-gray-600 mt-0.5 leading-relaxed break-words">{{ item.content }}</p>
          </div>
        </div>

        <!-- 回复区域 -->
        <div v-if="item.replies && item.replies.length > 0" class="ml-9 mt-2 space-y-2">
          <div v-for="(reply, ri) in item.replies" :key="reply.uuid || ri" class="flex gap-2">
            <img :src="useImage(reply.account.avatar, 80)" :alt="reply.name"
              class="w-5 h-5 rounded-full object-cover shrink-0 bg-gray-100" />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-[11px] font-medium text-gray-700">{{ reply.name }}</span>
                <span class="text-[10px] text-gray-400">{{ useTimeago(reply.created) }}</span>
              </div>
              <p class="text-[11px] text-gray-500 mt-0.5 leading-relaxed break-words">
                <span v-if="reply.reply_name" class="text-blue-500 mr-1">@{{ reply.reply_name }}</span>
                {{ reply.content }}
              </p>
            </div>
          </div>

          <!-- 查看全部回复 / 加载更多 -->
          <div v-if="item._repliesLoading" class="ml-0 text-center py-1">
            <svg class="animate-spin w-3.5 h-3.5 text-blue-400 inline-block" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <button v-else-if="hasMoreReplies(item)" @click="loadAllReplies(item)"
            class="text-[11px] text-blue-500 hover:text-blue-600 transition-colors ml-0">
            — 查看全部回复 ({{ remainingReplies(item) }})
          </button>
        </div>
      </div>

      <!-- 加载更多评论 -->
      <div v-if="state.hasMore" class="text-center pt-1">
        <button @click="loadMore" :disabled="state.loading"
          class="text-xs text-blue-500 hover:text-blue-600 disabled:text-gray-300 transition-colors">
          <span v-if="state.loading">加载中...</span>
          <span v-else>加载更多评论</span>
        </button>
      </div>
    </div>

    <!-- 评论输入框（任何状态下都展示） -->
    <div class="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
      <div class="flex gap-3">
        <textarea rows="2" v-model="content" :disabled="submitting" placeholder="说点什么..."
          class="flex-1 resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 disabled:bg-slate-50 disabled:cursor-not-allowed"></textarea>
        <button @click="submitComment" :disabled="submitting || !content.trim()"
          class="self-end px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5">
          <svg v-if="submitting" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {{ submitting ? '发表中…' : '发表评论' }}
        </button>
      </div>
    </div>
  </div>
</template>
