<script lang="ts" setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { uploadPictureByUrlUsingPost } from '@/api/pictureController.ts'

/**
 * 处理图片上传逻辑
 * 通过URL上传图片到服务器，并在成功后通知父组件
 */
const handleUpload = async () => {
  loading.value = true
  try {
    const params: API.PictureUploadRequest = { fileUrl: fileUrl.value }
    params.spaceId = props.spaceId
    if (props.picture) {
      params.id = props.picture ? { id: props.picture.id } : {}
    }

    const res = await uploadPictureByUrlUsingPost(params)
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

/**
 * 组件接收的属性定义
 * @property {API.PictureVO} [picture] - 当前显示的图片信息（可选）
 * @property {number} [spaceId] - 所属空间ID（可选）
 * @property {Function} [onSuccess] - 图片上传成功后的回调函数（可选）
 */
interface Props {
  picture?: API.PictureVO
  spaceId?: number
  onSuccess?: (newPicture: API.PictureVO) => void
}

const props = defineProps<Props>()

const loading = ref<boolean>(false)
const fileUrl = ref<string>('')
</script>
<template>
  <!-- URL图片上传区域 -->
  <div class="urlPictureUpload">
    <!-- 输入框和提交按钮组合 -->
    <a-input-group compact>
      <a-input
        v-model:value="fileUrl"
        style="width: calc(100% - 120px)"
        placeholder="请输入图片url地址"
      />
      <a-button type="primary" @click="handleUpload" :loading="loading">提交</a-button>
    </a-input-group>
    <!-- 显示当前图片预览 -->
    <div class="img-wrapper">
      <img v-if="picture?.url" :src="picture?.url" alt="avatar" />
    </div>
  </div>
</template>

<style scoped>
.urlPictureUpload {
  margin-bottom: 16px;
}

.urlPictureUpload img {
  max-width: 100%;
  max-height: 480px;
}

.urlPictureUpload .img-wrapper {
  text-align: center;
  margin-top: 16px;
}
</style>
