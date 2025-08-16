<script setup lang="ts">
import { h, ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { EditOutlined } from '@ant-design/icons-vue'
import useLoginUserStore from '@/stores/useLoginUserStore.ts'
import UserAvatarUpload from '@/components/UserAvatarUpload.vue'
import { updateUserUsingPost } from '@/api/userController.ts'

// 弹窗控制
const open = ref(false)
const loginUserStore = useLoginUserStore()
const loginUser = loginUserStore.loginUser

// 用于预览的临时头像URL
const tempAvatarUrl = ref('')

const showModal = () => {
  // 显示弹窗时，将当前用户信息填充到表单
  formData.value.userName = loginUser.userName || ''
  formData.value.userProfile = loginUser.userProfile || ''
  // 重置临时头像URL
  tempAvatarUrl.value = loginUser.userAvatar || ''
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
  id: undefined,
  userName: '',
  userProfile: '',
  userAvatar: '',
  userRole: ''
})

// 监听登录用户信息变化，更新表单数据
watch(loginUser, (newUser) => {
  if (open.value) {
    formData.value.userName = newUser.userName || ''
    formData.value.userProfile = newUser.userProfile || ''
    tempAvatarUrl.value = newUser.userAvatar || ''
  }
}, { deep: true })

const handleSubmit = async () => {
  try {
    // 设置用户ID
    formData.value.id = loginUser.id
    // 设置头像URL（使用可能更新过的临时头像）
    formData.value.userAvatar = tempAvatarUrl.value || loginUser.userAvatar || ''

    const res = await updateUserUsingPost(formData.value)
    if (res.data.code === 0) {
      message.success('用户信息更新成功')

      // 更新本地存储的用户信息
      loginUserStore.setLoginUser({
        ...loginUser,
        ...formData.value
      })

      closeModal()
    } else {
      message.error('操作失败: ' + (res.data.message || ''))
    }
  } catch (error: any) {
    console.error('更新用户信息失败:', error)
    message.error('操作失败: ' + (error.message || '网络错误'))
  }
}

const UserAvatarUploadRef = ref()
const onUserAvatarUpload = () => {
  UserAvatarUploadRef.value.showModal()
}

// 头像上传成功事件 - 用于预览
const onUserAvatarUploadSuccess = (newPicture: API.PictureVO) => {
  // 更新临时头像URL用于预览
  tempAvatarUrl.value = newPicture.url
}
</script>

<template>
  <a-modal
    class="user-information-upload"
    v-model:open="open"
    title="编辑个人资料"
    @cancel="closeModal"
    width="500px"
  :maskClosable="true"
  :footer="null"
  >
  <a-form
    name="basic"
    layout="vertical"
    :model="formData"
  >
    <!-- 头像和账号信息区域 -->
    <div class="avatar-account-section">
      <div class="avatar-container">
        <!-- 显示预览头像 -->
        <a-avatar :size="100" :src="tempAvatarUrl" class="avatar-img" />  <!-- 缩小头像尺寸 -->

      </div>
      <!-- 账号信息展示（不可编辑） -->
      <a-flex justify="space-between" align="center">
        <div class="account-info">
          <div class="account-label">账号</div>
          <div class="account-value">{{ loginUser.userAccount || '未设置' }}</div>
          <div class="account-desc">账号为唯一标识，不可修改</div>
        </div>
        <a-button
          type="primary"
          :icon="h(EditOutlined)"
          @click="onUserAvatarUpload"
          class="change-avatar-btn"
        >
          修改头像
        </a-button>
      </a-flex>

    </div>
    <!-- 昵称输入 -->
    <a-form-item
      label="昵称"
      name="userName"
      :rules="[{ required: true, message: '请输入昵称' }]"
    >
      <a-input v-model:value="formData.userName" placeholder="请输入昵称" class="nickname-input" />
    </a-form-item>

    <!-- 简介输入 -->
    <a-form-item label="简介" name="userProfile">
      <a-textarea
        v-model:value="formData.userProfile"
        placeholder="请输入个人简介"
        :rows="2"
        :auto-size="{ minRows: 2, maxRows: 5 }"
        allow-clear
      />
    </a-form-item>

    <a-form-item class="submit-btn-group">
      <a-button type="primary" @click="handleSubmit">确认修改</a-button>
    </a-form-item>
  </a-form>
  </a-modal>

  <UserAvatarUpload
    ref="UserAvatarUploadRef"
    :picture="{ url: tempAvatarUrl }"
    :onSuccess="onUserAvatarUploadSuccess"
  />
</template>

<style scoped>
.user-information-upload :deep(.ant-modal-body) {
  padding: 20px;  /* 减少内边距 */
}

/* 头像和账号区域样式 */
.avatar-account-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;  /* 减少底部间距 */
  padding-bottom: 15px;  /* 减少底部内边距 */
  border-bottom: 1px solid #f0f0f0;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 25px;  /* 减少右侧间距 */
}

.avatar-img {
  border: 3px solid #f5f5f5;  /* 减少边框宽度 */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);  /* 减轻阴影 */
  margin-bottom: 12px;  /* 减少底部间距 */
  transition: transform 0.3s ease;
}

.avatar-img:hover {
  transform: scale(1.05);
}

.change-avatar-btn {
  width: 100px;
  transition: all 0.2s;
  font-size: 14px;
  text-align: center;
  margin-left: 20px;
}

.change-avatar-btn:hover {
  transform: translateY(-2px);
}

/* 账号信息样式 */
.account-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.account-label {
  font-size: 13px;  /* 减小字体 */
  color: #8c8c8c;
  margin-bottom: 4px;  /* 减少底部间距 */
}

.account-value {
  font-size: 16px;  /* 减小字体 */
  font-weight: 500;
  color: #333;
  margin-bottom: 6px;  /* 减少底部间距 */
}

.account-desc {
  font-size: 12px;
  color: #b3b3b3;
  line-height: 1.4;  /* 调整行高 */
}

/* 表单项样式 */
:deep(.ant-form-item) {
  margin-bottom: 16px;  /* 减少表单项间距 */
}

/* 昵称输入框美化 */
.nickname-input {
  height: 40px;  /* 优化高度 */
  border-radius: 6px;  /* 增加圆角 */
  transition: all 0.2s;
}

.nickname-input:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

/* 确认按钮居中 */
.submit-btn-group {
  margin-top: 15px;
  display: flex;
  justify-content: center;  /* 水平居中 */
}

.submit-btn-group :deep(.ant-btn) {
  width: 160px;  /* 按钮宽度 */
  height: 40px;  /* 按钮高度 */
  font-size: 15px;  /* 按钮字体大小 */
}
</style>
