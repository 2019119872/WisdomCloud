<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import {
  FileAddOutlined,
  HomeOutlined,
  LogoutOutlined,
  PicCenterOutlined,
  PictureOutlined,
  ProfileOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons-vue'
import type { MenuProps } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import useLoginUserStore from '@/stores/useLoginUserStore.ts'
import { userLogoutUsingPost } from '@/api/userController.ts'

const loginUserStore = useLoginUserStore()

/**
 * 路由跳转处理函数
 * @param key - 点击菜单项的 key 值，用于路由跳转
 */
const router = useRouter()
const doMenuClick = ({ key }: { key: string }) => {
  // 忽略空键或分隔符
  if (key && key !== 'separator') {
    router.push(key)
  }
}

/**
 * 用户退出登录处理函数
 * 发起退出登录请求，清空用户状态并跳转到登录页
 */
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

/**
 * 当前选中菜单项的状态管理
 * 监听路由变化，动态更新当前高亮的菜单项
 */
const current = ref<string[]>(['/'])
router.afterEach((to) => {
  current.value = [to.path]
})

/**
 * 原始菜单项配置
 * 包含主页、管理中心（含子菜单）、添加图片等导航项
 */
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
]

/**
 * 过滤菜单项函数
 * 根据用户角色过滤菜单项，仅管理员可见管理中心
 * @param menus - 原始菜单项数组
 * @returns 过滤后的菜单项数组
 */
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

/**
 * 计算属性：过滤后的菜单项
 * 动态根据用户权限返回不同的菜单列表
 */
const items = computed(() => filterMenu(originItems))
</script>

<template>
  <!-- 全局头部组件 -->
  <div id="globalHeader">
    <!-- 使用 Ant Design 的 Row 布局容器，设置不换行 -->
    <a-row :wrap="false">
      <!-- 左侧 Logo 和标题区域 -->
      <a-col flex="200px">
        <!-- 点击跳转至首页 -->
        <router-link to="/">
          <div class="title-bar">
            <!-- Logo 图标 -->
            <img src="../assets/logo.svg" alt="logo" width="48" height="48" class="logo" />
            <!-- 系统标题 -->
            <span class="title">智云图库</span>
          </div>
        </router-link>
      </a-col>

      <!-- 中间导航菜单区域 -->
      <a-col flex="auto">
        <!-- 水平方向的 Ant Design 菜单组件 -->
        <a-menu
          @click="doMenuClick"
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="items"
        ></a-menu>
      </a-col>

      <!-- 右侧用户登录状态区域 -->
      <a-col flex="200px">
        <div class="user-login-status">
          <!-- 判断用户是否已登录 -->
          <div v-if="loginUserStore.loginUser.id">
            <!-- 用户已登录时显示头像和用户名，并提供下拉菜单 -->
            <a-dropdown>
              <a-space style="font-size: 16px">
                <!-- 用户头像 -->
                <a-avatar
                  size="large"
                  :src="loginUserStore.loginUser?.userAvatar || '/assets/notLoginUser.png'"
                />
                <!-- 用户名 -->
                {{ loginUserStore.loginUser.userName ?? '游客' }}
              </a-space>

              <!-- 下拉菜单内容 -->
              <template #overlay>
                <a-menu>
                  <!-- 个人中心 -->
                  <a-menu-item>
                    <router-link to="/user_detail">
                      <ProfileOutlined />
                      个人中心
                    </router-link>
                  </a-menu-item>
                  <!-- 我的空间 -->
                  <a-menu-item>
                    <router-link to="/my_space">
                      <UserOutlined />
                      我的空间
                    </router-link>
                  </a-menu-item>
                  <!-- 退出登录 -->
                  <a-menu-item @click="doLogout">
                    <LogoutOutlined />
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <!-- 用户未登录时显示登录按钮 -->
          <div v-else>
            <a-button type="primary" href="/user/login">登录</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
/* 标题栏布局样式 */
#globalHeader .title-bar {
  display: flex;
  align-items: center;
}

/* 系统标题文字样式 */
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

/* 保持选中项高亮样式 */
.ant-menu-item-selected {
  background-color: #e6f7ff !important;
}
</style>
