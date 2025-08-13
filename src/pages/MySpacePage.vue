<script setup lang="ts">
import { useRouter } from 'vue-router'
import useLoginUserStore from '@/stores/useLoginUserStore.ts'
import { listSpaceVoByPageUsingPost } from '@/api/spaceController.ts'
import { message } from 'ant-design-vue'
import { onMounted } from 'vue'
import { SPACE_TYPE_ENUM } from '@/constants/space.ts'

const router = useRouter()
const loginUserStore = useLoginUserStore
const checkUserSpace = async () => {
  const loginUser = loginUserStore().loginUser;
  if (!loginUser?.id) {
    router.replace('/user/login');
    return;
  }

  try {
    const res = await listSpaceVoByPageUsingPost({
      userId: loginUser.id,
      current: 1,
      pageSize: 1,
      spaceType: SPACE_TYPE_ENUM.PRIVATE
    });

    // 使用可选链访问res.data，避免res不包含data属性时出错
    if (res?.data?.code === 0) {
      if (res.data.data?.records?.length > 0) {
        const space = res.data.data.records[0];
        router.replace(`/space/${space.id}`);
      } else {
        router.replace('/add_space');
        message.warn('请先创建空间');
      }
    } else {
      // 只传递一个错误消息参数
      message.error(`加载我的空间失败: ${res?.data?.message || '未知错误'}`);
    }
  } catch (error) {
    // 捕获网络请求可能发生的异常
    message.error('请求失败，请稍后重试');
    console.error('获取空间信息失败:', error);
  }
};
onMounted(() => {
  checkUserSpace()
})
</script>

<template>
  <div class="mySpacePage">
  我的空间
  </div>
</template>

<style scoped>

</style>
