import { defineStore } from 'pinia'
import { ref } from "vue";
import { getLoginUserUsingGet } from '@/api/userController.ts'


/**
 * 存储用户登录信息的状态
 */
const useLoginUserStore = defineStore('loginUser', () => {
  // 状态
  const loginUser = ref<API.LoginUserVO>({
    userName: '未登录',
  });

  /**
   * 异步获取登录信息
   */
  async function fetchLoginUser() {
    // setTimeout(() => {
    //   loginUser.value = {
    //     userName: '测试',
    //     id: 1
    //   }
    // }, 3000)
    // return loginUser.value
    const res = await  getLoginUserUsingGet();
    if (res.data.code === 0 && res.data.data) {
      loginUser.value = res.data.data
    }
  }
  const setLoginUser = (newLoginUser: any) => {
    loginUser.value = newLoginUser
  }

  return {
    loginUser,
    setLoginUser,
    fetchLoginUser
  };
})

export default useLoginUserStore;
