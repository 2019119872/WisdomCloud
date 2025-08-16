<script setup lang="ts">
import { h, ref } from 'vue'
import { message } from 'ant-design-vue'
import { editPictureUsingPost } from '@/api/pictureController.ts'
import { EditOutlined } from '@ant-design/icons-vue'
import useLoginUserStore from '@/stores/useLoginUserStore.ts'
import UserAvatarUpload from '@/components/UserAvatarUpload.vue'
// 弹窗控制
const open = ref(false)
const loginUserStore = useLoginUserStore()
const loginUser = loginUserStore.loginUser
const showModal = () => {
  open.value = true
}
const closeModal = () => {
  open.value = false
}
defineExpose({
  showModal,
  closeModal
})

const formData = ref<API.UserUpdateRequest>({
  userName: '',
  userProfile: '',

})
const handleSubmit = async (values: any) => {
  const pictureId = picture.value?.id
  if (!pictureId) {
    message.error('请上传图片')
    return
  }
  const res = await editPictureUsingPost({
    id: pictureId,

    ...values,
  })
  if (res.data.code === 0 && res.data.data) {
    message.success(  '编辑成功')
  } else {
    message.error( '操作失败' + res.data.message )
  }
}
const UserAvatarUploadRef = ref()
const onUserAvatarUpload = () => {
  UserAvatarUploadRef.value.showModal()
}
// 编辑成功事件
const onUserInformationEditSuccess = (newPicture: API.PictureVO) => {

}
</script>

<template>
  <a-modal
    class="user-information-upload"
    v-model:open="open"
    title="编辑个人资料"
    @cancel="closeModal"
    width="800px"
    :maskClosable="true"
    :footer="null"
  >
    <a-form
      name="basic"
      layout="vertical"
      :model="formData"
      @finish="handleSubmit"
    >
      <a-descriptions :column="1">
        <a-descriptions-item label="用户头像">
            <a-avatar :size="96" :src="loginUser.userAvatar" />
        </a-descriptions-item>
        <a-space>
          <a-button
            type="primary"
            :icon="h(EditOutlined)"
            @click="onUserAvatarUpload"
          >修改头像
          </a-button>
        </a-space>

      </a-descriptions>
      <a-form-item
        label="昵称"
        name="userName"
        :rules="[{ required: true, message: '请输入昵称' }]"
      >
        <a-input v-model:value="formData.userName" placeholder="请输入昵称" />
      </a-form-item>
      <a-form-item label="简介" name="userProfile">
        <a-textarea
          v-model:value="formData.userProfile"
          placeholder="请输入个人简介"
          :rows="2"
          :auto-size="{ minRows: 2, maxRows: 5 }"
          allow-clear
        />
      </a-form-item>

      <a-form-item >
        <a-button type="primary" html-type="submit" > 确认修改</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
  <UserAvatarUpload
    ref="UserAvatarUploadRef"
    :onSuccess="onUserAvatarUploadSuccess"
  />
</template>

<style scoped>
/* 可添加模态框内容区域样式 */
.user-information-upload :deep(.ant-modal-body) {
  padding: 20px;
}
</style>
