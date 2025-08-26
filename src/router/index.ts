import { createRouter, createWebHistory } from 'vue-router'
import HomePage from "@/pages/HomePage.vue";
import userLoginPage from "@/pages/user/userLoginPage.vue";
import userRegisterPage from "@/pages/user/userRegisterPage.vue";
import userManagePage from "@/pages/admin/userManagePage.vue";
import AddPicturePage from "@/pages/AddPicturePage.vue";
import pictureManagePage from "@/pages/admin/pictureManagePage.vue";
import PictureDetailPage from '@/pages/PictureDetailPage.vue'
import AddPictureBatchPage from '@/pages/AddPictureBatchPage.vue'
import SpaceManagePage from '@/pages/admin/SpaceManagePage.vue'
import AddSpacePage from '@/pages/AddSpacePage.vue'
import MySpacePage from '@/pages/MySpacePage.vue'
import SpaceDetailPage from '@/pages/SpaceDetailPage.vue'
import SearchPicturePage from '@/pages/SearchPicturePage.vue'
import SpaceAnalyzePage from '@/pages/SpaceAnalyzePage.vue'
import SpaceUserManagePage from '@/pages/admin/SpaceUserManagePage.vue'
import UserDetailsPage from '@/pages/user/userDetailsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/user/login',
      name: '用户登录',
      component: userLoginPage,
    },
    {
      path: '/user/register',
      name: '用户注册',
      component: userRegisterPage,
    },
    {
      path: '/admin/userManage',
      name: '用户管理',
      component: userManagePage,
    },
    {
      path: '/admin/pictureManage',
      name: '图片管理',
      component: pictureManagePage,
    },
    {
      path: '/admin/spaceManage',
      name: '空间管理',
      component: SpaceManagePage,
    },
    {
      path: '/add_picture',
      name: '添加图片',
      component: AddPicturePage
    },
    {
      path: '/add_space',
      name: '创建空间',
      component: AddSpacePage
    },
    {
      path: '/my_space',
      name: '我的空间',
      component: MySpacePage
    },
    {
      path: '/add_picture/batch',
      name: '批量添加图片',
      component: AddPictureBatchPage
    },
    {
      path: '/picture/:id',
      name: '图片详细',
      component:PictureDetailPage,
      props: true
    },
    {
      path: '/space/:id',
      name: '空间详细',
      component:SpaceDetailPage,
      props: true
    },
    {
      path: '/user_detail',
      name: '用户详细',
      component:UserDetailsPage
    },
    {
      path: '/space_analyze',
      name: '空间分析',
      component:SpaceAnalyzePage,
    },
    {
      path: '/spaceUserManage/:id',
      name: '空间成员管理',
      component:SpaceUserManagePage,
      props: true
    },
    {
      path: '/search_picture',
      name: '图片搜索',
      component: SearchPicturePage
    }

  ],
})

export default router
