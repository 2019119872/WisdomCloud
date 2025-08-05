import { createRouter, createWebHistory } from 'vue-router'
import HomePage from "@/pages/HomePage.vue";
import userLoginPage from "@/pages/user/userLoginPage.vue";
import userRegisterPage from "@/pages/user/userRegisterPage.vue";
import userManagePage from "@/pages/admin/userManagePage.vue";
import AddPicturePage from "@/pages/AddPicturePage.vue";
import pictureManagePage from "@/pages/admin/pictureManagePage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    // 懒加载方式
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('@/pages/AboutView.vue'),
    // },
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
      path: '/add_picture',
      name: '添加图片',
      component: AddPicturePage
    }
  ],
})

export default router
