<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { EditOutlined } from '@ant-design/icons-vue'
import useLoginUserStore from '@/stores/useLoginUserStore.ts'
import UserInformationEdit from '@/components/UserInformationEdit.vue'
const loginUserStore = useLoginUserStore()
const picture = ref<API.PictureVO>()
const loginUser = computed(() => loginUserStore.loginUser)
const userInformationEditRef = ref()
const onUserInformationEdit = () => {
  userInformationEditRef.value.showModal()
}
// 编辑成功事件
const onUserInformationEditSuccess = (newPicture: API.PictureVO) => {
}
</script>
<template>
  <div id="pictureDetailPage">
    <h2>个人资料</h2>
    <a-row :gutter="[16, 16]">
      <!-- 头像展示区 -->
      <a-col :sm="2" :md="4" :xl="6">
        <a-card title="用户头像">
          <a-image style="max-height: 200px; object-fit: contain" :src="loginUser.userAvatar" />
        </a-card>
      </a-col>
      <!-- 图片信息区 -->
      <a-col :sm="22" :md="20" :xl="18">
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
            <a-space>
              <a-button
                type="primary"
                :icon="h(EditOutlined)"
                @click="onUserInformationEdit"
                >编辑个人资料
              </a-button>
            </a-space>

          </a-descriptions>
        </a-card>
      </a-col>
    </a-row>
  </div>
  <UserInformationEdit  ref="userInformationEditRef"  :onSuccess="onUserInformationEditSuccess" />
</template>
<style scoped>
#pictureDetailPage {
  margin-bottom: 20px;
}
</style>
