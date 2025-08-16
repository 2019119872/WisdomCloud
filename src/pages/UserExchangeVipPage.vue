<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { exchangeVipUsingPost } from '@/api/userController.ts' // 假设API路径正确
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const formData = ref<API.VipExchangeRequest>({
  vipCode: '',
})

const handleSubmit = async (values: any) => {
  // 表单验证
  if (!formData.value.vipCode || formData.value.vipCode.trim() === '') {
    message.warning('请输入会员兑换码')
    return
  }

  loading.value = true
  try {
    const res = await exchangeVipUsingPost(formData.value)
    if (res.data.code === 0 && res.data.data) {
      message.success('会员兑换成功！')
      // 兑换成功后可以跳转到会员中心或个人主页
      router.push('/user/member')
    } else {
      message.error(res.data.message || '兑换失败，请检查兑换码是否正确')
    }
  } catch (error) {
    message.error('网络错误，兑换失败')
    console.error('兑换失败:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div id="vipExchangePage">
    <div class="page-header">
      <h2>会员码兑换</h2>
      <p>输入您的会员兑换码，激活会员权益</p>
    </div>

    <a-form
      name="vipExchangeForm"
      layout="vertical"
      :model="formData"
      @finish="handleSubmit"
      class="exchange-form"
    >
      <a-form-item
        label="会员兑换码"
        name="vipCode"
        :rules="[{ required: true, message: '请输入会员兑换码' }]"
      >
        <a-input
          v-model:value="formData.vipCode"
          placeholder="请输入16位会员兑换码"
          max-length="128"
          allow-clear
        />
        <p class="form-hint">提示：兑换码区分大小写，请准确输入</p>
      </a-form-item>

      <a-form-item class="submit-btn-group">
        <a-button
          type="primary"
          html-type="submit"
          style="width: 100%"
          :loading="loading"
          size="large"
        >
          立即兑换
        </a-button>
        <a-button style="width: 100%; margin-top: 12px" @click="$router.back()" size="large">
          返回
        </a-button>
      </a-form-item>
    </a-form>

    <div class="exchange-benefits">
      <h3>会员权益</h3>
      <ul>
        <li>
          <a-icon type="check-circle" theme="filled" />
          专属会员标识
        </li>
        <li>
          <a-icon type="check-circle" theme="filled" />
          高级功能访问权限
        </li>
        <li>
          <a-icon type="check-circle" theme="filled" />
          无广告浏览体验
        </li>
        <li>
          <a-icon type="check-circle" theme="filled" />
          专属客服支持
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
#vipExchangePage {
  padding: 20px;
  max-width: 540px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-header {
  text-align: center;
  margin: 30px 0 40px;
}

.page-header h2 {
  font-size: 24px;
  margin-bottom: 8px;
  color: #1f2329;
}

.page-header p {
  color: #6b7280;
  font-size: 14px;
}

.exchange-form {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
  margin-bottom: 30px;
}

.form-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 0;
}

.submit-btn-group {
  margin-top: 20px;
}

.exchange-benefits {
  background: #f9fafb;
  padding: 20px;
  border-radius: 8px;
  margin-top: auto;
}

.exchange-benefits h3 {
  font-size: 16px;
  margin-bottom: 16px;
  color: #1f2329;
  display: flex;
  align-items: center;
}

.exchange-benefits h3::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 16px;
  background: #1677ff;
  margin-right: 8px;
  border-radius: 2px;
}

.exchange-benefits ul {
  padding-left: 24px;
}

.exchange-benefits li {
  margin-bottom: 10px;
  color: #4b5563;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.exchange-benefits li .anticon {
  color: #52c41a;
  margin-right: 8px;
}
</style>
