<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import {
  FileAddOutlined,
  HomeOutlined,
  LogoutOutlined,
  PicCenterOutlined,
  PictureOutlined,
  SettingOutlined,
  ProfileOutlined
} from '@ant-design/icons-vue'
import type { MenuProps } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import useLoginUserStore from '@/stores/useLoginUserStore.ts'
import { userLogoutUsingPost } from '@/api/userController.ts'
import { message } from 'ant-design-vue'
import { UserOutlined } from '@ant-design/icons-vue'

const loginUserStore = useLoginUserStore()
// 路由跳转事件
const router = useRouter()
const doMenuClick = ({ key } : { key: string }) => {
  // 忽略空键或分隔符
  if (key && key !== 'separator') {
    router.push(key)
  }
}
const doLogout = async () => {
  const res = await userLogoutUsingPost()
  if (res.data.code === 0) {
    loginUserStore.setLoginUser({
      userName: '未登录',
    })
    message.success('退出登录成功')
    await router.push('/user/login')
  } else {
    message.error('退出失败' + res.data.message)
  }
}
// 监听路由变化，更新要高亮的菜单项
const current = ref<string[]>(['/'])
router.afterEach((to) => {
  current.value = [to.path]
})

// 原始菜单项，将三个管理页面整合到下拉菜单中
const originItems = [
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页',
  },
  // 管理下拉菜单
  {
    key: 'admin',
    icon: () => h(SettingOutlined),
    label: '管理中心',
    title: '管理中心',
    children: [
      {
        key: '/admin/userManage',
        icon: () => h(UserOutlined),
        label: '用户管理',
        title: '用户管理',
      },
      {
        key: '/admin/pictureManage',
        icon: () => h(PictureOutlined),
        label: '图片管理',
        title: '图片管理',
      },
      {
        key: '/admin/spaceManage',
        icon: () => h(PicCenterOutlined),
        label: '空间管理',
        title: '空间管理',
      },
    ],
  },
  {
    key: '/add_picture',
    icon: () => h(FileAddOutlined),
    label: '添加图片',
    title: '添加图片',
  },
  {
    key: '/user_exchange_vip',
    label: '兑换会员',
    title: '兑换会员',
  },
  {
    key: '/others',
    label: h('a', { href: '#', target: '_blank' }, '智题云'),
    title: '智题云',
  },
]

// 过滤菜单，仅管理员可见管理中心
const filterMenu = (menus = [] as MenuProps['items']) => {
  return menus?.filter((menu) => {
    // 检查是否是管理中心菜单
    if (menu?.key === 'admin') {
      const loginUser = loginUserStore.loginUser
      // 非管理员不显示整个管理中心菜单
      if (!loginUser || loginUser.userRole !== 'admin') {
        return false
      }
      // 保留子菜单结构
      return true
    }
    return true
  })
}

const items = computed(() => filterMenu(originItems))
</script>

<template>
  <div id="globalHeader">
    <a-row :wrap="false">
      <a-col flex="200px">
        <router-link to="/">
          <div class="title-bar">
            <img src="../assets/logo.svg" alt="logo" width="48" height="48" class="logo" />
            <span class="title">智云图库</span>
          </div>
        </router-link>
      </a-col>
      <a-col flex="auto">
        <a-menu
          @click="doMenuClick"
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="items"
        ></a-menu>
      </a-col>
      <a-col flex="200px">
        <div class="user-login-status">
          <div v-if="loginUserStore.loginUser.id">
            <a-dropdown>
              <a-space style="font-size: 16px">
                <a-avatar
                  size="large"
                  :src="loginUserStore.loginUser?.userAvatar || '/assets/notLoginUser.png'"
                />
                {{ loginUserStore.loginUser.userName ?? '游客' }}
              </a-space>

              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <router-link to="/user_detail">
                      <ProfileOutlined />
                     个人中心
                    </router-link>
                  </a-menu-item>
                  <a-menu-item>
                    <router-link to="/my_space">
                      <UserOutlined />
                      我的空间
                    </router-link>
                  </a-menu-item>
                  <a-menu-item @click="doLogout">
                    <LogoutOutlined />
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <div v-else>
            <a-button type="primary" href="/user/login">登录</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
#globalHeader .title-bar {
  display: flex;
  align-items: center;
}

#globalHeader .title {
  margin-left: 16px;
  color: black;
  font-size: 20px;
}

/* 优化下拉菜单样式 */
.ant-menu-horizontal > .ant-menu-submenu {
  position: relative;
}

.ant-menu-horizontal > .ant-menu-submenu:hover .ant-menu-sub {
  display: block;
}

/* 保持选中项高亮 */
.ant-menu-item-selected {
  background-color: #e6f7ff !important;
}
</style>
