<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  editPictureUsingPost,
  getPictureVoByIdUsingGet,
  listPictureTagCategoryUsingGet, uploadPictureByBatchUsingPost
} from '@/api/pictureController.ts'

import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const formData = ref<API.PictureUploadByBatchRequest>({
 count: 10,

})

const handleSubmit = async (values: any) => {
  loading.value = true
  const res = await uploadPictureByBatchUsingPost({
    ...formData.value,
  })
  if (res.data.code === 0 && res.data.data) {
    message.success( `添加成功，共${res.data.data}条`)
    router.push(`/homePage`)
  } else {
    message.error(res.data.message || '操作失败')
  }
  loading.value = false
}
</script>

<template>
  <div id="addPictureBatchPage">
    <h2 style="margin-bottom: 16px">批量添加图片</h2>
      <a-form name="basic" layout="vertical" :model="formData" @finish="handleSubmit">
        <a-form-item
          label="关键词"
          name="searchText"
          :rules="[{ required: true, message: '请输入关键词' }]"
        >
          <a-input v-model:value="formData.searchText" placeholder="请输入关键词" />
        </a-form-item>
        <a-form-item label="抓取数量" name="count">
          <a-input-number
            v-model:value="formData.count"
            placeholder="请输入数量 "
            :min="1"
            :max="30"
            style="min-width: 180px"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="名称前缀" name="namePrefix">
          <a-auto-complete
            v-model:value="formData.namePrefix"
            placeholder="请输入名称前缀，会自动补充序号"
            allow-clear
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" style="width: 100%" :loading="loading">执行任务</a-button>
        </a-form-item>
      </a-form>
  </div>
</template>

<style scoped>
#addPictureBatchPage {
  padding: 20px;
  max-width: 720px;
  margin: 0 auto;
}
</style>
