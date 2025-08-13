<script setup lang="ts">
import { ref } from 'vue'
import { uploadPictureUsingPost } from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'

interface Props {
  imageUrl?: string
  picture?: API.PictureVO
  spaceId?: number
  onSuccess?: (newPicture: API.PictureVO) => void
}

const props = defineProps<Props>()

// 编辑器组件的引用
const cropperRef = ref()

// 向左旋转
const rotateLeft = () => {
  cropperRef.value.rotateLeft()
}

// 向右旋转
const rotateRight = () => {
  cropperRef.value.rotateRight()
}

// 缩放
const changeScale = (num: number) => {
  cropperRef.value.changeScale(num)
}
const handleConfirm = () => {
  cropperRef.value.getCropBlob((blob: Blob) => {
  const fileName = (props.picture?.name || 'image') + '.png'
    const file = new File([blob], fileName, { type: blob.type})
    handleUpload({ file })
  })
}
const loading = ref(false)
const handleUpload = async ({ file }: any) => {
  loading.value = true
  try {
    const params: API.PictureUploadRequest = props.picture ? { id: props.picture.id } : {}
    params.spaceId = props.spaceId
    const res = await uploadPictureUsingPost(params, {}, file)
    if (res.data.code === 0 && res.data.data) {
      message.success('图片上传成功')
      // 将上传成功的图片信息传递给父组件
      props.onSuccess?.(res.data.data)
      closeModal()
    }
  } catch (error: any) {
    console.error('图片上传失败',error)
    message.error('图片上传失败' + error.message)
  }
  loading.value = false
}
const open = ref(false)
const showModal = () => {
  open.value = true
}

const closeModal = () => {
  open.value = false
}
defineExpose({
  showModal
})
</script>
<template>
    <a-modal class="image-cropper" v-model:open="open" title="编辑图片" :footer="false" @cancel="closeModal">
      <vue-cropper
        ref="cropperRef"
        :img="imageUrl"
        :autoCrop="true"
        :canMove="false"
        :fixedBox="false"
        :centerBox="true"
        :canMoveBox="true"
        :info="true"
        outputType="png"
      />
      <div style="margin-bottom: 16px" />
      <!-- 图片操作 -->
      <div class="image-cropper-actions">
        <a-space>
          <a-button @click="rotateLeft">向左旋转</a-button>
          <a-button @click="rotateRight">向右旋转</a-button>
          <a-button @click="changeScale(1)">放大</a-button>
          <a-button @click="changeScale(-1)">缩小</a-button>
          <a-button type="primary" :loading="loading" @click="handleConfirm">确认</a-button>
        </a-space>
      </div>
    </a-modal>
</template>

<style >
.image-cropper {
  text-align: center;
}

.image-cropper .vue-cropper {
  height: 400px !important;
}
</style>
