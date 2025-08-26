<script lang="ts" setup>
import { reactive } from 'vue'
import { userLoginUsingPost } from '@/api/userController.ts'
import router from '@/router'
import useLoginUserStore from '@/stores/useLoginUserStore.ts'
import { message } from 'ant-design-vue'

const loginUserStore = useLoginUserStore()

/**
 * 表单数据状态对象，用于存储用户登录时输入的账号和密码
 */
const formState = reactive<API.UserLoginRequest>({
  userAccount: '',
  userPassword: '',
})

/**
 * 处理用户登录表单提交事件
 * @param values 表单提交的数据，包含用户账号和密码
 * @returns Promise<void>
 */
const handleSubmit = async (values: any) => {
  const res = await userLoginUsingPost(values)
  if (res.data.code === 0 && res.data.data) {
    // 登录成功后获取用户信息并跳转到首页
    await loginUserStore.fetchLoginUser()
    message.success('登录成功')
    router.push('/')
  } else {
    // 登录失败显示错误信息
    message.error(res.data.message)
  }
}

/**
 * 处理表单提交失败事件
 * @param errorInfo 包含表单验证失败信息的对象
 * @returns void
 */
const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
</script>
<template>
  <div id="userLoginPage">
    <h2 class="title">智云图库-用户登录</h2>
    <div class="desc">企业级智能协同云图库</div>
    <!-- 用户登录表单 -->
    <a-form
      :model="formState"
      name="basic"
      autocomplete="off"
      @finish="handleSubmit"
      @finishFailed="onFinishFailed"
    >
      <!-- 用户账号输入框 -->
      <a-form-item name="userAccount" :rules="[{ required: true, message: '请输入你的账户名!' }]">
        <a-input
          v-model:value="formState.userAccount"
          placeholder="请输入你的账户名:"
          allow-clear
        />
      </a-form-item>

      <!-- 用户密码输入框 -->
      <a-form-item
        name="userPassword"
        :rules="[
          { required: true, message: '请输入用户密码!' },
          { min: 8, message: '密码长度不能小于8位' },
        ]"
      >
        <a-input-password
          v-model:value="formState.userPassword"
          placeholder="请输入用户密码:"
          allow-clear
        />
      </a-form-item>

      <!-- 注册提示链接 -->
      <div class="tips">
        没有账号？
        <router-link to="/user/register">
          <a>去注册</a>
        </router-link>
      </div>

      <!-- 登录按钮 -->
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<style scoped>
#userLoginPage {
  max-width: 360px;
  margin: 0 auto;
  text-align: center;
}

.title {
  margin-bottom: 16px;
}

.desc {
  color: #666;
  margin-bottom: 16px;
}

.tips {
  text-align: right;
  margin-bottom: 16px;
  font-size: 14px;
  color: #666;
}
</style>
