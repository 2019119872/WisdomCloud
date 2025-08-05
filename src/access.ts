import useLoginUserStore from "@/stores/useLoginUserStore.ts";
import {message} from "ant-design-vue";
import router from "@/router";

let firstFetchLoginUser = true;
router.beforeEach(async (to, from, next) => {
  const loginUserStore = useLoginUserStore();
  let loginUser = loginUserStore.loginUser;
  if (firstFetchLoginUser) {
    await  loginUserStore.fetchLoginUser();
    loginUser = loginUserStore.loginUser;
    firstFetchLoginUser = false;
  }
  const toUrl = to.fullPath
  if (toUrl.startsWith('/admin')){
    if (loginUser.userRole != 'ADMIN' && !loginUser) {
      message.error('你没有权限访问该页面！')
      next(`/user/login?redirect= ${to.fullPath}`)
      return
    }
  }
  next();
})
