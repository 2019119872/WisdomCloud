<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { EditOutlined } from '@ant-design/icons-vue'
import useLoginUserStore from '@/stores/useLoginUserStore.ts'
import UserInformationEdit from '@/components/UserInformationEdit.vue'

const loginUserStore = useLoginUserStore()
const loginUser = computed(() => loginUserStore.loginUser)
const userInformationEditRef = ref()

const onUserInformationEdit = () => {
  userInformationEditRef.value.showModal()
}

// 编辑成功事件
const onUserInformationEditSuccess = () => {
  // 可以在这里添加编辑成功后的处理逻辑
  console.log('用户信息更新成功')
}
</script>

<template>
  <div id="userDetailsPage">
    <h2>个人资料</h2>
    <a-row :gutter="[16, 16]">
      <!-- 头像展示区 -->
      <a-col :sm="24" :md="8" :xl="6">
        <a-card title="用户头像">
          <div style="text-align: center">
            <a-avatar :size="128" :src="loginUser.userAvatar" />
          </div>
        </a-card>
      </a-col>
      
      <!-- 用户信息区 -->
      <a-col :sm="24" :md="16" :xl="18">
        <a-card title="用户信息">
          <a-descriptions :column="1">
            <a-descriptions-item label="昵称">
              <a-space>
                <a-avatar :size="24" :src="loginUser.userAvatar" />
                <div>{{ loginUser?.userName }}</div>
              </a-space>
            </a-descriptions-item>
            <a-descriptions-item label="账号">
              {{ loginUser.userAccount }}
            </a-descriptions-item>
            <a-descriptions-item label="简介">
              {{ loginUser.userProfile ?? '暂无简介' }}
            </a-descriptions-item>
            <a-descriptions-item>
              <a-button
                type="primary"
                :icon="h(EditOutlined)"
                @click="onUserInformationEdit"
              >编辑个人资料
              </a-button>
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-col>
    </a-row>
  </div>
  <UserInformationEdit ref="userInformationEditRef" @success="onUserInformationEditSuccess" />
</template>

<style scoped>
#userDetailsPage {
  margin-bottom: 20px;
}
</style>
