<script lang="ts" setup>
import { ref } from 'vue'

/**
 * 组件属性接口定义
 * @property {string} title - 模态框标题，默认值为'分享图片'
 * @property {string} link - 分享链接，默认值为'http://www.baidu.com'
 */
interface Props {
  title: string
  link: string
}

/**
 * 定义组件属性并设置默认值
 * @param {Props} props - 组件接收的属性
 */
const props = withDefaults(defineProps<Props>(), {
  title: '分享图片',
  link: 'http://www.baidu.com',
})

/**
 * 控制模态框显示状态的响应式变量
 */
const open = ref(false)

/**
 * 显示模态框函数
 * @returns {void}
 */
const showModal = () => {
  open.value = true
}

/**
 * 关闭模态框函数
 * @returns {void}
 */
const closeModal = () => {
  open.value = false
}

/**
 * 暴露组件方法给父组件使用
 */
defineExpose({
  showModal,
})
</script>

<template>
  <!-- 分享模态框组件 -->
  <div class="shareModal">
    <!-- Ant Design 模态框组件 -->
    <a-modal v-model:open="open" :title="props.title" :footer="false" @cancel="closeModal">
      <!-- 分享链接复制区域 -->
      <h4>复制分享链接</h4>
      <a-typography-link copyable>
        {{ props.link }}
      </a-typography-link>
      <div style="margin-bottom: 16px"></div>
      <!-- 二维码展示区域 -->
      <h4>手机扫码查看</h4>
      <a-qrcode :value="props.link" />
    </a-modal>
  </div>
</template>
