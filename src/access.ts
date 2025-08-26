import useLoginUserStore from "@/stores/useLoginUserStore.ts";
import {message} from "ant-design-vue";
import router from "@/router";

let firstFetchLoginUser = true;

/**
 * 路由前置守卫，用于权限验证和用户登录状态检查
 *
 * @param to 即将要进入的目标路由对象
 * @param from 当前导航正要离开的路由对象
 * @param next 用来resolve路由钩子的函数，必须调用该函数才能让导航继续
 */
router.beforeEach(async (to, from, next) => {
  const loginUserStore = useLoginUserStore();
  let loginUser = loginUserStore.loginUser;

  // 首次访问时获取登录用户信息
  if (firstFetchLoginUser) {
    await  loginUserStore.fetchLoginUser();
    loginUser = loginUserStore.loginUser;
    firstFetchLoginUser = false;
  }

  const toUrl = to.fullPath

  // 检查访问/admin路径的权限
  if (toUrl.startsWith('/admin')){
    // 验证用户是否为管理员角色且已登录
    if (loginUser.userRole != 'ADMIN' && !loginUser) {
      message.error('你没有权限访问该页面！')
      next(`/user/login?redirect= ${to.fullPath}`)
      return
    }
  }

  next();
})
