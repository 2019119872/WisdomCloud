<script setup lang="ts">
import { ref } from 'vue'
import {
  createPictureOutPaintingTaskUsingPost,
  getPictureOutPaintingTaskUsingGet,
  uploadPictureByUrlUsingPost,
} from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'

/**
 * 组件接收的属性定义
 */
interface Props {
  /**
   * 原始图片信息
   */
  picture?: API.PictureVO
  /**
   * 空间ID，用于上传新图片时指定所属空间
   */
  spaceId?: number
  /**
   * 操作成功后的回调函数，传入新生成的图片信息
   * @param newPicture 新上传的图片对象
   */
  onSuccess?: (newPicture: API.PictureVO) => void
}

const props = defineProps<Props>()

/**
 * 控制模态框显示状态
 */
const open = ref(false)

/**
 * 显示模态框
 */
const showModal = () => {
  open.value = true
}

/**
 * 关闭模态框
 */
const closeModal = () => {
  open.value = false
}

// 暴露方法给父组件调用
defineExpose({
  showModal,
})

/**
 * 当前任务ID，用于轮询获取结果
 */
const taskId = ref<string | null>()

/**
 * 扩图结果图片URL
 */
const resultImageUrl = ref<string>('')

/**
 * 创建AI扩图任务
 * 调用后端接口创建扩图任务，并开始轮询任务状态
 */
const createTask = async () => {
  // 如果没有原始图片ID则不执行
  if (!props.picture?.id) {
    return
  }

  // 调用API创建扩图任务
  const res = await createPictureOutPaintingTaskUsingPost({
    pictureId: props.picture.id,
    parameters: {
      xScale: 2,
      yScale: 2,
    },
  })

  // 处理响应结果
  if (res.data.code === 0 && res.data.data) {
    message.success('创建任务成功，请耐性等待，不要退出界面')
    taskId.value = res.data.data.output?.taskId
    startPolling()
  } else {
    message.error('创建任务失败' + res.data.message)
  }
}

/**
 * 轮询定时器ID
 */
let pollingTimer: number | null = null

/**
 * 开始轮询任务状态
 * 定时请求后端接口检查任务执行状态
 */
const startPolling = () => {
  // 如果没有任务ID则不执行
  if (!taskId.value) {
    return
  }

  // 设置定时器每3秒查询一次任务状态
  pollingTimer = setInterval(async () => {
    try {
      // 查询任务状态
      const res = await getPictureOutPaintingTaskUsingGet({
        taskId: taskId.value,
      })

      // 处理任务状态响应
      if (res.data.code === 0 && res.data.data) {
        const taskResult = res.data.data.output
        // 任务成功完成
        if (taskResult?.taskStatus === 'SUCCEEDED') {
          message.success('扩图任务执行成功')
          resultImageUrl.value = taskResult.outputImageUrl
          clearPolling()
          // 任务执行失败
        } else if (taskResult?.taskStatus === 'FAILED') {
          message.error('扩图任务执行失败')
          clearPolling()
        }
      }
    } catch (e: any) {
      console.error('扩图任务轮询失败', e)
      message.error('扩图任务轮询失败' + e.message)
      clearPolling()
    }
  }, 3000)
}

/**
 * 清除轮询定时器
 * 停止任务状态查询并重置相关状态
 */
const clearPolling = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
    taskId.value = null
  }
}

/**
 * 上传按钮加载状态
 */
const uploadLoading = ref(false)

/**
 * 处理扩图结果上传
 * 将扩图结果上传到服务器并通知父组件
 */
const handleUpload = async () => {
  uploadLoading.value = true
  try {
    // 构造上传参数
    const params: API.PictureUploadRequest = {
      fileUrl: resultImageUrl.value,
      spaceId: props.spaceId,
    }
    params.spaceId = props.spaceId
    if (props.picture) {
      params.id = props.picture?.id
    }

    // 调用上传接口
    const res = await uploadPictureByUrlUsingPost(params)

    // 处理上传结果
    if (res.data.code === 0 && res.data.data) {
      message.success('图片上传成功')
      // 将上传成功的图片信息传递给父组件
      props.onSuccess?.(res.data.data)
      closeModal()
    }
  } catch (error: any) {
    console.error('图片上传失败', error)
    message.error('图片上传失败' + error.message)
  }
  uploadLoading.value = false
}
</script>
<template>
  <!-- AI扩图功能模态框 -->
  <a-modal
    class="imageOutPainting"
    v-model:open="open"
    title="AI 扩图"
    :footer="false"
    @cancel="closeModal"
  >
    <!-- 图片对比展示区域 -->
    <a-row gutter="16">
      <!-- 原始图片展示 -->
      <a-col span="12">
        <h4>原始图片</h4>
        <img :src="picture?.url" :alt="picture?.name" style="max-width: 100%" />
      </a-col>
      <!-- 扩图结果展示 -->
      <a-col span="12">
        <h4>扩图结果</h4>
        <img
          v-if="resultImageUrl"
          :src="resultImageUrl"
          :alt="picture?.name"
          style="max-width: 100%"
        />
      </a-col>
    </a-row>

    <!-- 间距调整 -->
    <div style="margin-bottom: 16px"></div>

    <!-- 操作按钮区域 -->
    <a-flex justify="center" gap="16">
      <!-- 生成扩图按钮 -->
      <a-button type="primary" :loading="!!taskId" ghost @click="createTask">生成图片</a-button>
      <!-- 应用结果按钮（仅在有结果时显示） -->
      <a-button v-if="resultImageUrl" type="primary" :loading="uploadLoading" @click="handleUpload"
        >应用结果</a-button
      >
    </a-flex>
  </a-modal>
</template>

<style>
/* 扩图模态框样式 */
.imageOutPainting {
  text-align: center;
}
</style>
