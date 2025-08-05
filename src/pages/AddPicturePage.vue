<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  editPictureUsingPost,

  getPictureVoByIdUsingGet,
  listPictureTagCategoryUsingGet
} from '@/api/pictureController.ts'

import { useRoute, useRouter } from 'vue-router'
import PictureUpload from '@/components/PictureUpload.vue'

const route = useRoute()
const router = useRouter()
const picture = ref<API.PictureVO>()
const formData = ref<API.PictureEditRequest>({
  name: '',
  introduction: '',
  category: '',
  tags: [],
})

// 定义onSuccess回调函数的正确类型
const onSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
  formData.value.name = newPicture.name
}

const handleSubmit = async (values: any) => {
  const pictureId = picture.value?.id || route.query?.id
  if (!pictureId) {
    message.error('请上传图片')
    return
  }
  const res = await editPictureUsingPost({
    id: pictureId,
    ...values,
  })
  if (res.data.code === 0 && res.data.data) {
    message.success(route.query?.id ? '编辑成功' : '添加成功')
    router.push(`/picture/${pictureId}`)
  } else {
    message.error(res.data.message || '操作失败')
  }
}

const tagOptions = ref<{ label: string; value: string }[]>([])
// 原定义是string[]，但实际需要的是{label: string, value: string}[]类型
const categoryOptions = ref<{ label: string; value: string }[]>([])

const getTagCategoryOptions = async () => {
  try {
    const res = await listPictureTagCategoryUsingGet()
    if (res && res.data && res.data.code === 0) {
      const data = res.data.data || {}
      // tagOptions同理，确保其类型定义也是{label: string; value: string}[]
      tagOptions.value = (data.tagList ?? []).map((tag: string) => ({
        label: tag,
        value: tag,
      }))
      // 现在赋值类型与categoryOptions的定义匹配
      categoryOptions.value = (data.categoryList ?? []).map((category: string) => ({
        label: category,
        value: category,
      }))
    }
  } catch (error) {
    console.error('获取标签和分类失败：', error)
  }
}

onMounted(() => {
  getTagCategoryOptions()
})

const getOldPicture = async () => {
  const pictureId = route.query?.id
  // if (!pictureId) {
  //   return
  // }
  if (pictureId) {
    const res = await getPictureVoByIdUsingGet({
      id: pictureId,
    })
    if (res.data.code === 0 && res.data.data) {
      const data = res.data.data
      picture.value = data
      formData.value.name = data.name
      formData.value.introduction = data.introduction
      formData.value.category = data.category
      formData.value.tags = data.tags
    }
  }
}
onMounted(() => {
  getOldPicture()
})
</script>

<template>
  <div id="addPicturePage">
    <h2 style="margin-bottom: 16px">
      {{ route.query.id ? '编辑图片' : '添加图片' }}
    </h2>

    <PictureUpload :picture="picture" :onSuccess="onSuccess" />
    <a-form name="basic" v-if="picture" layout="vertical" :model="formData" @finish="handleSubmit">
      <a-form-item label="名称" name="name" :rules="[{ required: true, message: '请输入名称' }]">
        <a-input v-model:value="formData.name" placeholder="请输入名称" />
      </a-form-item>
      <a-form-item label="简介" name="introduction">
        <a-textarea
          v-model:value="formData.introduction"
          placeholder="请输入简介"
          :rows="2"
          :auto-size="{ minRows: 2, maxRows: 5 }"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="分类" name="category">
        <a-auto-complete
          v-model:value="formData.category"
          :options="categoryOptions"
          placeholder="请输入分类"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="标签" name="tags">
        <a-select
          v-model:value="formData.tags"
          :options="tagOptions"
          mode="tags"
          placeholder="请输入标签"
          allow-clear
        />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%"> 添加</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
#addPicturePage {
  padding: 20px;
  max-width: 720px;
  margin: 0 auto;
}
</style>
