<script lang="ts" setup>
import { ref } from 'vue'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { message, type UploadProps } from 'ant-design-vue'
import { uploadPictureUsingPost } from '@/api/pictureController.ts'

/**
 * 组件属性定义
 * @property {API.PictureVO} [picture] - 当前图片信息（可选）
 * @property {number} [spaceId] - 空间ID（可选）
 * @property {(newPicture: API.PictureVO) => void} [onSuccess] - 上传成功回调函数（可选）
 */
interface Props {
  picture?: API.PictureVO
  spaceId?: number
  onSuccess?: (newPicture: API.PictureVO) => void
}

const props = defineProps<Props>()

const loading = ref<boolean>(false)

/**
 * 上传前校验文件格式和大小
 * @param file - 待上传的文件对象
 * @returns {boolean} 校验是否通过
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
 * 处理图片上传请求
 * @param options - 上传配置对象，包含待上传的文件
 */
const handleUpload = async ({ file }: any) => {
  loading.value = true
  try {
    // 构造上传参数
    const params: API.PictureUploadRequest = props.picture ? { id: props.picture.id } : {}
    params.spaceId = props.spaceId
    const res = await uploadPictureUsingPost(params, {}, file)
    if (res.data.code === 0 && res.data.data) {
      message.success('图片上传成功')
      // 将上传成功的图片信息传递给父组件
      props.onSuccess?.(res.data.data)
    }
  } catch (error: any) {
    console.error('图片上传失败', error)
    message.error('图片上传失败' + error.message)
  }
  loading.value = false
}
</script>
<template>
  <div class="pictureUpload">
    <!-- 图片上传区域 -->
    <a-upload
      list-type="picture-card"
      :show-upload-list="false"
      :custom-request="handleUpload"
      :before-upload="beforeUpload"
    >
      <!-- 显示已上传的图片或上传图标 -->
      <img v-if="picture?.url" :src="picture?.url" alt="avatar" />
      <div v-else>
        <loading-outlined v-if="loading"></loading-outlined>
        <plus-outlined v-else></plus-outlined>
        <div class="ant-upload-text">点击或拖拽上传图片</div>
      </div>
    </a-upload>
    <!-- 上传提示信息 -->
    <div class="tips">
      温馨提示：图片大小不符合上传要求，
      <a href="https://docsmall.com/image-compress" target="_blank">压缩图片</a>
    </div>
  </div>
</template>

<style scoped>
.pictureUpload :deep(.ant-upload) {
  width: 100% !important;
  height: 100% !important;
  min-height: 152px;
  min-width: 152px;
}

.pictureUpload img {
  max-width: 100%;
  max-height: 480px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
