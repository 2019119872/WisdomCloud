<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import {
  editPictureByBatchUsingPost,
  editPictureUsingPost,
  listPictureTagCategoryUsingGet
} from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'

interface Props {
  pictureList: API.PictureVO [],
  spaceId: number,
  onSuccess: () => void
}
const props = withDefaults(defineProps<Props>(), {})
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
const formData = ref<API.PictureEditByBatchRequest>({
 category: '',
  tags: [],
  nameRule: '',

})
const tagOptions = ref<{ label: string; value: string }[]>([])
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
const handleSubmit = async (values: any) => {
  if (!props.pictureList) {
    return
  }
  const res = await editPictureByBatchUsingPost({
    pictureIdList: props.pictureList.map((picture) => picture.id),
    spaceId: props.spaceId,
    ...values,
  })
  if (res.data.code === 0 && res.data.data) {
    message.success('操作成功')
    closeModal()
    props.onSuccess?.()
  } else {
    message.error(res.data.message || '操作失败')
  }
}
</script>

<template>
  <div class="shareModal">
    <a-modal v-model:open="open" title="批量编辑图片" :footer="false" @cancel="closeModal">
     <a-typography-paragraph>
       只对当前页面的图片生效
       <a-form
         name="basic"
         layout="vertical"
         :model="formData"
         @finish="handleSubmit"
       >
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
         <a-form-item
           label="命名规则"
           name="nameRule"
           :rules="[{ required: true, message: '请输入名称' }]"
         >
           <a-input v-model:value="formData.nameRule" placeholder="请输入命名规则，输入 {序号} 可动态生成" allow-clear />
         </a-form-item>
         <a-form-item>
           <a-button type="primary" html-type="submit" style="width: 100%"> 提交</a-button>
         </a-form-item>
       </a-form>
     </a-typography-paragraph>
    </a-modal>
  </div>
</template>
