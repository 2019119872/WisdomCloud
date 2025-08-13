<script lang="ts" setup>
import { ref } from 'vue'

interface Props {
  title: string,
  link: string
}
const props = withDefaults(defineProps<Props>(), {
  title: '分享图片',
  link: 'http://www.baidu.com'
})
const open = ref(false)
const showModal = () => {
  open.value = true
}

const closeModal = () => {
  open.value = false
}
defineExpose({
  showModal
})
</script>

<template>
  <div class="shareModal">
    <a-modal v-model:open="open" :title="props.title" :footer="false" @cancel="closeModal">
      <h4>复制分享链接</h4>
      <a-typography-link copyable>
        {{ props.link }}
      </a-typography-link>
      <div style="margin-bottom: 16px"></div>
      <h4>手机扫码查看</h4>
      <a-qrcode :value="props.link"/>
    </a-modal>
  </div>
</template>
