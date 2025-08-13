<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { HomeOutlined, LogoutOutlined } from '@ant-design/icons-vue'
import type { MenuProps } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import useLoginUserStore from '@/stores/useLoginUserStore.ts'
import { userLogoutUsingPost } from '@/api/userController.ts'
import { message } from 'ant-design-vue'
import { UserOutlined } from '@ant-design/icons-vue'

const loginUserStore = useLoginUserStore()
// 路由跳转事件
const router = useRouter()
const doMenuClick = ({ key }) => {
  // console.log(key)
  router.push(key)
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
//监听路由变化，更新要高亮的菜单项
const current = ref<string[]>(['/'])
router.afterEach((to, from, next) => {
  current.value = [to.path]
})
const originItems = [
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页',
  },
  // {
  //   key: '/about',
  //   label: '关于',
  //   title: '关于',
  // },
  {
    key: '/admin/userManage',
    label: '用户管理',
    title: '用户管理',
  },
  {
    key: '/admin/pictureManage',
    label: '图片管理',
    title: '图片管理',
  },
  {
    key: '/admin/spaceManage',
    label: '空间管理',
    title: '空间管理',
  },
  {
    key: '/add_picture',
    label: '添加图片',
    title: '添加图片',
  },
  // {
  //   key: '/add_space',
  //   label: '添加空间',
  //   title: '添加空间',
  // },
  {
    key: '/others',
    label: h('a', { href: '#', target: '_blank' }, '智题云'),
    title: '智题云',
  },
]
const filterMenu = (menus = [] as MenuProps['items']) => {
  return menus?.filter((menu) => {
    if (menu?.key?.startsWith('/admin')) {
      const loginUser = loginUserStore.loginUser
      if (!loginUser || loginUser.userRole !== 'admin') {
        return false
      }
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
                  :src="loginUserStore.loginUser.userAvatar || '/assets/logo.png'"
                />
                {{ loginUserStore.loginUser.userName ?? '游客' }}
              </a-space>

              <template #overlay>
                <a-menu>
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
</style>
