<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { EditOutlined } from '@ant-design/icons-vue'
import useLoginUserStore from '@/stores/useLoginUserStore.ts'
import UserInformationEdit from '@/components/UserInformationEdit.vue'

/**
 * 获取登录用户状态管理实例
 */
const loginUserStore = useLoginUserStore()

/**
 * 计算属性：获取当前登录用户信息
 * @returns {Object} 当前登录用户对象
 */
const loginUser = computed(() => loginUserStore.loginUser)

/**
 * 用户信息编辑组件的引用
 */
const userInformationEditRef = ref()

/**
 * 打开用户信息编辑弹窗
 * 调用子组件的 showModal 方法显示编辑窗口
 */
const onUserInformationEdit = () => {
  userInformationEditRef.value.showModal()
}

/**
 * 用户信息更新成功回调函数
 * 在用户信息编辑成功后触发，用于处理更新后的逻辑
 */
const onUserInformationEditSuccess = () => {
  console.log('用户信息更新成功')
}
</script>

<template>
  <div id="userDetailsPage">
    <h2>个人资料</h2>
    <a-row :gutter="[24, 24]">
      <!-- 头像展示区 -->
      <a-col :sm="24" :md="12" :xl="10">
        <a-card title="用户头像" class="avatar-card">
          <div class="avatar-container">
            <a-image
              :src="loginUser.userAvatar"
              alt="用户头像"
              class="main-avatar"
              style="max-height: 180px"
              preview
            />
          </div>
        </a-card>
      </a-col>

      <!-- 用户信息区 -->
      <a-col :sm="24" :md="12" :xl="14">
        <a-card title="用户信息" class="info-card">
          <div class="info-content">
            <div class="info-wrapper">
              <a-descriptions :column="1" :size="'middle'">
                <a-descriptions-item label="昵称">
                  <a-space size="middle">
                    <a-avatar :size="28" :src="loginUser.userAvatar" />
                    <div class="info-value">{{ loginUser?.userName || '未设置' }}</div>
                  </a-space>
                </a-descriptions-item>
                <a-descriptions-item label="账号">
                  <div class="info-value">{{ loginUser.userAccount || '未知' }}</div>
                </a-descriptions-item>
                <a-descriptions-item label="简介">
                  <div class="info-value">{{ loginUser.userProfile ?? '暂无简介' }}</div>
                </a-descriptions-item>
                <a-space>
                  <a-button
                    type="primary"
                    :icon="h(EditOutlined)"
                    @click="onUserInformationEdit"
                    size="middle"
                  >
                    编辑个人资料
                  </a-button>
                </a-space>
              </a-descriptions>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>

  <!-- 用户信息编辑组件 -->
  <UserInformationEdit ref="userInformationEditRef" @success="onUserInformationEditSuccess" />
</template>

<style scoped>
#userDetailsPage {
  margin: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

#userDetailsPage h2 {
  margin-bottom: 24px;
  color: #1f2329;
  font-size: 22px;
  font-weight: 600;
}

.avatar-card {
  height: 300px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.avatar-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.avatar-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.main-avatar {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #f5f5f5;
}

/* 用户信息区样式优化 */
.info-card {
  height: 300px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.info-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.info-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
}

.info-wrapper {
  width: 100%;
}

/* 减小信息内容字体 */
:deep(.ant-descriptions-middle .ant-descriptions-item-label) {
  font-size: 16px;
  font-weight: 500;
  color: #6b7280;
  padding-bottom: 10px !important;
}

:deep(.ant-descriptions-middle .ant-descriptions-item-content) {
  font-size: 16px;
  padding-bottom: 10px !important;
  line-height: 1.6;
}

.info-value {
  word-break: break-all;
}
</style>
