<script setup lang="ts">
import { computed, onUnmounted, ref, watchEffect } from 'vue'
import { uploadPictureUsingPost } from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'
import useLoginUserStore from '@/stores/useLoginUserStore.ts'
import  PictureEditWebSocket from '@/utils/pictureEditWebsocket.ts'
import {
  PICTURE_EDIT_ACTION_ENUM,
  PICTURE_EDIT_MESSAGE_TYPE_ENUM
} from '@/constants/picture.ts'
import { SPACE_TYPE_ENUM } from '@/constants/space.ts'

interface Props {
  imageUrl?: string
  picture?: API.PictureVO
  spaceId?: number
  onSuccess?: (newPicture: API.PictureVO) => void
  space?: API.SpaceVO
}

const props = defineProps<Props>()
const loginUserStore = useLoginUserStore()
const loginUser = loginUserStore.loginUser
const editingUser = ref<API.UserVO>()
const isTeamSpace = computed(() => {
  return props.space?.spaceType === SPACE_TYPE_ENUM.TEAM
})
// 编辑器组件的引用
const cropperRef = ref()

// 向左旋转
const rotateLeft = () => {
  cropperRef.value.rotateLeft()
  editAction(PICTURE_EDIT_ACTION_ENUM.ROTATE_LEFT)
}

// 向右旋转
const rotateRight = () => {
  cropperRef.value.rotateRight()
  editAction(PICTURE_EDIT_ACTION_ENUM.ROTATE_RIGHT)
}

// 缩放
const changeScale = (num: number) => {
  cropperRef.value.changeScale(num)
  if (num > 0) {
    editAction(PICTURE_EDIT_ACTION_ENUM.ZOOM_IN)
  } else {
    editAction(PICTURE_EDIT_ACTION_ENUM.ZOOM_OUT)
  }
}
const handleConfirm = () => {
  cropperRef.value.getCropBlob((blob: Blob) => {
    const fileName = (props.picture?.name || 'image') + '.png'
    const file = new File([blob], fileName, { type: blob.type })
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
    console.error('图片上传失败', error)
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
  if (websocket) {
    websocket?.disconnect()
  }
  editingUser.value = undefined
}
defineExpose({
  showModal,
})


const canEnterEdit = computed(() => {
  return !editingUser.value
})
const canExitEdit = computed(() => {
  return editingUser.value?.id === loginUser.id
})
const canEdit = computed(() => {
  if (!isTeamSpace.value) {
    return true
  }
  return editingUser.value?.id === loginUser.id
})
let websocket: PictureEditWebSocket | null
const initWebsocket = () => {
  const pictureId = props.picture?.id
  if (!pictureId || !open.value) {
    return
  }
  if (websocket) {
    websocket.disconnect()
  }
  websocket = new PictureEditWebSocket(pictureId)
  websocket.connect()
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.INFO, (msg) => {
    console.log('收到通知消息', msg)
    message.info(msg.message)
  })
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.ERROR, (msg) => {
    console.log('收到错误通知', msg)
    message.error(msg.message)
  })
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.ENTER_EDIT, (msg) => {
    console.log('收到进入编辑状态消息', msg)
    message.info(msg.message)
    editingUser.value = msg.user
  })
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.EXIT_EDIT, (msg) => {
    console.log('收到退出编辑状态消息', msg)
    message.info(msg.message)
    editingUser.value = undefined
  })
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.EDIT_ACTION, (msg) => {
    console.log('收到执行编辑操作消息', msg)
    message.info(msg.message)
    // cropperRef.value.setData(msg.data)
    switch (msg.editAction) {
      case PICTURE_EDIT_ACTION_ENUM.ROTATE_LEFT:
        cropperRef.value.rotateLeft()
        break
      case PICTURE_EDIT_ACTION_ENUM.ROTATE_RIGHT:
        cropperRef.value.rotateRight()
        break
      case PICTURE_EDIT_ACTION_ENUM.ZOOM_IN:
        cropperRef.value.changeScale(1)
        break
      case PICTURE_EDIT_ACTION_ENUM.ZOOM_OUT:
        cropperRef.value.changeScale(-1)
        break
    }
  })
}
watchEffect(() => {
  if (isTeamSpace.value) {
    initWebsocket()
  }
})

onUnmounted(() => {
  if (websocket) {
    websocket?.disconnect()
  }
  editingUser.value = undefined
})
const enterEdit = () => {
  if (websocket) {
    websocket.sendMessage({
      type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.ENTER_EDIT,
      message: '进入编辑状态',
    })
  }
}
const exitEdit = () => {
  if (websocket) {
    websocket.sendMessage({
      type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.EXIT_EDIT,
      message: '退出编辑状态',
    })
  }
}
const editAction = (action: string) => {
  if (websocket) {
    websocket.sendMessage({
      type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.EDIT_ACTION,
      editAction: action,
    })
  }
}
</script>
<template>
  <a-modal
    class="image-cropper"
    v-model:open="open"
    title="编辑图片"
    :footer="false"
    @cancel="closeModal"
  >
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
    <!-- 图片协同操作 -->
    <div class="image-edit-actions" v-if="isTeamSpace">
      <a-space>
        <a-button v-if="editingUser" disabled>{{editingUser?.userName}}} 正在编辑</a-button>
        <a-button v-if="canEnterEdit" type="primary" ghost @click="enterEdit">进入编辑</a-button>
        <a-button v-if="canExitEdit" danger ghost @click="exitEdit">退出编辑</a-button>

      </a-space>
    </div>
    <div style="margin-bottom: 16px" />
    <!-- 图片操作 -->
    <div class="image-cropper-actions">
      <a-space>
        <a-button @click="rotateLeft" :disabled="!canEdit">向左旋转</a-button>
        <a-button @click="rotateRight" :disabled="!canEdit">向右旋转</a-button>
        <a-button @click="changeScale(1)" :disabled="!canEdit">放大</a-button>
        <a-button @click="changeScale(-1)" :disabled="!canEdit">缩小</a-button>
        <a-button type="primary" :loading="loading" @click="handleConfirm" :disabled="!canEdit">确认</a-button>
      </a-space>
    </div>
  </a-modal>
</template>

<style>
.image-cropper {
  text-align: center;
}

.image-cropper .vue-cropper {
  height: 400px !important;
}
</style>
