<script setup lang="ts">
import { ref } from 'vue'
import { uploadPictureUsingPost } from '@/api/pictureController.ts'
import { message, type UploadProps } from 'ant-design-vue'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue'
import useLoginUserStore from '@/stores/useLoginUserStore.ts'

interface Props {
  picture?: API.PictureVO
  onSuccess?: (newPicture: API.PictureVO) => void
}

const props = defineProps<Props>()
const open = ref(false)
const showModal = () => {
  open.value = true
}

const closeModal = () => {
  open.value = false
}
// 暴露组件方法
defineExpose({
  showModal,
  closeModal,
})
const loading = ref<boolean>(false)

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
const handleUpload = async ({ file }: any) => {
  loading.value = true
  try {
    const params: API.PictureUploadRequest = props.picture ? { id: props.picture.id } : {}
    const res = await uploadPictureUsingPost(params, {}, file)
    if (res.data.code === 0 && res.data.data) {
      message.success('头像上传成功')
      // 将上传成功的图片信息传递给父组件
      useLoginUserStore().loginUser.userAvatar = res.data.data
    }
  } catch (error: any) {
    console.error('图片上传失败',error)
    message.error('图片上传失败' + error.message)
  }
  loading.value = false
}
</script>

<template>
  <a-modal
    class="imageOutPainting"
    v-model:open="open"
    title="上传头像"
    :footer="false"
    @cancel="closeModal"
  >
    <a-upload
      list-type="picture-card"
      :show-upload-list="false"
      :custom-request="handleUpload"
      :before-upload="beforeUpload"
    >
      <img v-if="picture?.url" :src="picture?.url" alt="avatar" />
      <div v-else>
        <loading-outlined v-if="loading"></loading-outlined>
        <plus-outlined v-else></plus-outlined>
        <div class="ant-upload-text">点击或拖拽上传图片</div>
      </div>
    </a-upload>
    <div class="tips">
     <span style="color: red">*温馨提示</span> ：如遇图片大小不符合上传要求，前往
      <a href="https://docsmall.com/image-compress" target="_blank">压缩图片</a>
    </div>
  </a-modal>
</template>

<style>
.imageOutPainting {
  text-align: center;
  padding: 16px;
}

.ant-upload-picture-card-wrapper {
  justify-content: center;
  margin-bottom: 16px;
}
</style>

