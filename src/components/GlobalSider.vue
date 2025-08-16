<script lang="ts" setup>
import { computed, h, ref, watchEffect } from 'vue'
import { PictureOutlined, TeamOutlined, UsergroupAddOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import useLoginUserStore from '@/stores/useLoginUserStore.ts'
import { SPACE_TYPE_ENUM } from '@/constants/space.ts'
import { listMyTeamSpaceUsingPost } from '@/api/spaceUserController.ts'
import { message } from 'ant-design-vue'

const loginUserStore = useLoginUserStore()

// 路由跳转事件
const router = useRouter()
const doMenuClick = ({ key }: { key: string }) => {
  router.push(key)
}

// 监听路由变化，更新要高亮的菜单项
const current = ref<string[]>(['/'])
router.afterEach((to) => {
  current.value = [to.path]
})

const fixedMenuItems = [
  {
    key: '/',
    icon: () => h(PictureOutlined),
    label: '公共图库',
  },
  {
    key: '/my_space',
    icon: () => h(UserOutlined),
    label: '我的空间',
  },
  {
    key: '/add_space?type=' + SPACE_TYPE_ENUM.TEAM,
    icon: () => h(UsergroupAddOutlined),
    label: '创建团队',
  },
]

const teamSpaceList = ref<API.SpaceUserVO[]>([])

const menuItems = computed(() => {
  // 没有团队空间，只展示固定菜单
  if (teamSpaceList.value.length < 1) {
    return fixedMenuItems
  }

  // 展示团队空间分组
  const teamSpaceSubMenus = teamSpaceList.value.map((spaceUser) => {
    const space = spaceUser.space;
    return {
      key: `/space/${spaceUser.spaceId}`,
      label: space?.spaceName || '未知团队',
    }
  })

  const teamSpaceMenuGroup = {
    type: 'group',
    label: '我的团队',
    key: 'teamSpace',
    children: teamSpaceSubMenus,
  }

  return [...fixedMenuItems, teamSpaceMenuGroup]
})

// 加载团队空间列表
const fetchTeamSpaceList = async () => {
  try {
    const res = await listMyTeamSpaceUsingPost()
    if (res.data.code === 0) {
      teamSpaceList.value = res.data.data || []
    } else {
      message.error('加载我的团队空间失败：' + (res.data.message || '未知错误'))
    }
  } catch (error) {
    message.error('加载团队空间时发生网络错误')
    console.error('团队空间加载失败:', error)
  }
}

/**
 * 监听登录状态，登录后加载团队空间
 */
watchEffect(() => {
  // 登录才加载
  if (loginUserStore.loginUser?.id) {
    fetchTeamSpaceList()
  }
})
</script>

<template>
  <div id="globalSider">
    <a-layout-sider
      v-if="loginUserStore.loginUser?.id"
      width="140"
      breakpoint="lg"
      collapsed-width="0"
    >
      <a-menu
        v-model:selectedKeys="current"
        mode="inline"
        :items="menuItems"
        @click="doMenuClick"
      />
    </a-layout-sider>
  </div>
</template>

<style scoped>
#globalSider .ant-layout-sider {
  background: none;
}
</style>

