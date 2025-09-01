<script lang="ts" setup>
import { reactive } from 'vue'
import router from '@/router'
import useLoginUserStore from '@/stores/useLoginUserStore.ts'
import { message } from 'ant-design-vue'
import { userRegisterUsingPost } from '@/api/userController.ts'

const loginUserStore = useLoginUserStore()

/**
 * 表单数据状态对象，用于存储用户注册时输入的信息
 * 包含用户账户名、密码和确认密码字段
 */
const formState = reactive<API.UserRegisterRequest>({
  userAccount: '',
  userPassword: '',
  checkPassword: '',
})

/**
 * 处理用户注册表单提交事件
 * 验证两次输入的密码是否一致，并调用后端接口完成注册流程
 * @param values 表单提交的数据对象
 */
const handleSubmit = async (values: any) => {
  // 检查两次输入的密码是否一致
  if (formState.userPassword !== formState.checkPassword) {
    message.error('密码不一致')
    return
  }

  // 调用后端注册接口
  const res = await userRegisterUsingPost(values)

  // 根据接口返回结果进行相应处理
  if (res.data.code === 0 && res.data.data) {
    message.success('注册成功')
    loginUserStore.setLoginUser(res.data.data)
    router.push('/user/login')
  } else {
    message.error(res.data.message)
  }
}

/**
 * 表单提交失败回调函数
 * 在控制台输出表单验证失败的相关信息
 * @param errorInfo 表单验证失败的信息对象
 */
const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
</script>
<template>
  <div id="userRegisterPage">
    <h2 class="title">智云图库-用户注册</h2>
    <div class="desc">企业级智能协同云图库</div>
    <!-- 用户注册表单 -->
    <a-form
      :model="formState"
      name="basic"
      autocomplete="off"
      @finish="handleSubmit"
      @finishFailed="onFinishFailed"
    >
      <!-- 用户账户名输入项 -->
      <a-form-item name="userAccount" :rules="[{ required: true, message: '请输入你的账户名!' }]">
        <a-input v-model:value="formState.userAccount" placeholder="请输入你的账户名:" />
      </a-form-item>

      <!-- 用户密码输入项 -->
      <a-form-item
        name="userPassword"
        :rules="[
          { required: true, message: '请输入用户密码!' },
          { min: 8, message: '密码长度不能小于8位' },
        ]"
      >
        <a-input-password v-model:value="formState.userPassword" placeholder="请输入用户密码:" />
      </a-form-item>

      <!-- 确认密码输入项 -->
      <a-form-item
        name="checkPassword"
        :rules="[
          { required: true, message: '请再次输入用户密码!' },
          { min: 8, message: '确认密码长度不能小于8位' },
        ]"
      >
        <a-input-password
          v-model:value="formState.checkPassword"
          placeholder="请再次输入用户密码:"
        />
      </a-form-item>

      <!-- 登录跳转提示 -->
      <div class="tips">
        已有账号？
        <router-link to="/user/login">
          <a>去登录</a>
        </router-link>
      </div>

      <!-- 注册按钮 -->
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">注册</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<style scoped>
#userRegisterPage {
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
