<script setup lang="ts">
import { ref } from 'vue'
import { uploadPictureUsingPost } from '@/api/pictureController.ts'
import { message, type UploadProps } from 'ant-design-vue'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue'
import useLoginUserStore from '@/stores/useLoginUserStore.ts'

/**
 * 组件属性定义
 * @property {API.PictureVO} [picture] - 当前图片信息，用于预览
 * @property {(newPicture: API.PictureVO) => void} [onSuccess] - 上传成功回调函数
 */
interface Props {
  picture?: API.PictureVO
  onSuccess?: (newPicture: API.PictureVO) => void
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'success', newPicture: API.PictureVO): void
}>()

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

// 暴露组件方法
defineExpose({
  showModal,
  closeModal,
})

const loading = ref<boolean>(false)

/**
 * 上传前校验文件格式和大小
 * @param {UploadProps['fileList'][number]} file - 待上传的文件对象
 * @returns {boolean} 是否通过校验
 */
const beforeUpload = (file: UploadProps['fileList'][number]) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('不支持上传该格式的图片，推荐 jpg 或 png')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('不能上传超过 2M 的图片')
  }
  return isJpgOrPng && isLt2M
}

/**
 * 处理图片上传逻辑
 * @param {any} options - 上传配置参数，包含文件信息
 */
const handleUpload = async ({ file }: any) => {
  loading.value = true
  try {
    // 构造上传参数，如果存在原图片则传递其ID作为更新操作
    const params: API.PictureUploadRequest = props.picture
      ? { id: props.picture.id, isAvatar: true }
      : { isAvatar: true }

    const res = await uploadPictureUsingPost(params, {}, file)
    if (res.data.code === 0 && res.data.data) {
      message.success('头像上传成功')
      const newPicture = res.data.data
      // 更新用户头像URL并触发成功事件
      useLoginUserStore().loginUser.userAvatar = newPicture.url
      emit('success', newPicture)
      closeModal()
    }
  } catch (error: any) {
    console.error('图片上传失败', error)
    message.error('图片上传失败' + error.message)
  }
  loading.value = false
}
</script>

<template>
  <!-- 图片上传模态框 -->
  <a-modal
    class="imageOutPainting"
    v-model:open="open"
    title="上传头像"
    :footer="false"
    @cancel="closeModal"
    width="500px"
  >
    <div class="upload-container">
      <!-- 图片上传组件 -->
      <a-upload
        list-type="picture-card"
        :show-upload-list="false"
        :custom-request="handleUpload"
        :before-upload="beforeUpload"
      >
        <div class="upload-area">
          <!-- 图片预览区域 -->
          <div class="image-preview-container" v-if="picture?.url">
            <img :src="picture?.url" alt="avatar" class="preview-img" />
          </div>
          <!-- 上传占位符区域 -->
          <div v-else class="upload-placeholder">
            <loading-outlined v-if="loading" class="loading-icon"></loading-outlined>
            <plus-outlined v-else class="plus-icon"></plus-outlined>
            <div class="upload-text">点击或拖拽上传图片</div>
            <div class="upload-subtext">支持 JPG、PNG 格式，不超过 2MB</div>
          </div>
        </div>
      </a-upload>
    </div>

    <!-- 温馨提示 -->
    <div class="tips">
      <span style="color: red">*温馨提示</span>：如遇图片大小不符合上传要求，前往
      <a href="https://docsmall.com/image-compress" target="_blank" class="compress-link"
        >压缩图片</a
      >
    </div>
  </a-modal>
</template>

<style scoped>
.imageOutPainting {
  text-align: center;
  padding: 20px;
}

.upload-container {
  margin-bottom: 20px;
}

:deep(.ant-upload-picture-card-wrapper) {
  justify-content: center;
  margin-bottom: 0;
}

/* 上传框基础样式 - 固定尺寸 */
:deep(.ant-upload) {
  width: 220px !important;
  height: 220px !important;
  border-radius: 12px;
  border: 2px dashed #d9d9d9;
  transition: all 0.3s ease;
  overflow: hidden; /* 防止内容溢出 */
}

:deep(.ant-upload:hover) {
  border-color: #1890ff;
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 图片预览容器 - 与上传框尺寸严格一致 */
.image-preview-container {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden; /* 裁剪超出部分 */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 5px;
}

/* 预览图片样式 - 确保填充容器且不变形 */
.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 保持比例填充容器，裁剪多余部分 */
  border-radius: 10px;
}

/* 上传占位区域 - 与上传框尺寸一致 */
.upload-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.plus-icon {
  font-size: 36px;
  color: #8c8c8c;
  margin-bottom: 12px;
}

.loading-icon {
  font-size: 36px;
  color: #1890ff;
  margin-bottom: 12px;
}

.upload-text {
  font-size: 16px;
  color: #333;
  margin-bottom: 6px;
}

.upload-subtext {
  font-size: 12px;
  color: #8c8c8c;
}

.tips {
  margin-top: 15px;
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

.compress-link {
  color: #1890ff;
  text-decoration: underline;
}

.compress-link:hover {
  color: #096dd9;
}
</style>
