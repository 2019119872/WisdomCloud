<script lang="ts" setup>
import { reactive } from 'vue'
import router from '@/router'
import useLoginUserStore from '@/stores/useLoginUserStore.ts'
import { message } from 'ant-design-vue'
import {userRegisterUsingPost} from "@/api/userController.ts";

const loginUserStore = useLoginUserStore()
const formState = reactive<API.UserRegisterRequest>({
  userAccount: '',
  userPassword: '',
  checkPassword: '',
})
const handleSubmit = async (values: any) => {
  if (formState.userPassword !== formState.checkPassword){
    message.error('密码不一致')
    return
  }
    const res = await userRegisterUsingPost(values);
    if (res.data.code === 0 && res.data.data) {
      message.success('注册成功')
      loginUserStore.setLoginUser(res.data.data)
      router.push('/user/login')
    }else{  message.error( res.data.message)}



}
const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
</script>
<template>
  <div id="userRegisterPage">
    <h2 class="title">智云图库-用户注册</h2>
    <div class="desc">企业级智能协同云图库</div>
    <a-form
      :model="formState"
      name="basic"
      autocomplete="off"
      @finish="handleSubmit"
      @finishFailed="onFinishFailed"
    >
      <a-form-item name="userAccount" :rules="[{ required: true, message: '请输入你的账户名!' }]">
        <a-input v-model:value="formState.userAccount" placeholder="请输入你的账户名:" />
      </a-form-item>

      <a-form-item
        name="userPassword"
        :rules="[
          { required: true, message: '请输入用户密码!' },
          { min: 8, message: '密码长度不能小于8位' },
        ]"
      >
        <a-input-password v-model:value="formState.userPassword" placeholder="请输入用户密码:" />
      </a-form-item>
      <a-form-item
        name="checkPassword"
        :rules="[
          { required: true, message: '请再次输入用户密码!' },
          { min: 8, message: '确认密码长度不能小于8位' },
        ]"
      >
        <a-input-password v-model:value="formState.checkPassword" placeholder="请再次输入用户密码:" />
      </a-form-item>
      <div class="tips">
        已有账号？
        <router-link to="/user/login">
          <a>去登录</a>
        </router-link>
      </div>

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
