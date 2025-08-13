<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  addSpaceUsingPost,
  getSpaceVoByIdUsingGet,
  listSpaceLevelUsingGet,
  updateSpaceUsingPost,
} from '@/api/spaceController.ts'

import { useRoute, useRouter } from 'vue-router'
import { SPACE_LEVEL_OPTIONS, SPACE_TYPE_ENUM, SPACE_TYPE_MAP } from '@/constants/space.ts'
import { formatSize } from '@/utils'

const route = useRoute()
const router = useRouter()
const space = ref<API.SpaceVO>()
const formData = ref<API.SpaceAddRequest | API.SpaceEditRequest>({})
const loading = ref(false)
const spaceLevelList = ref<API.SpaceLevel[]>([])
const spaceType = computed(() => {
  if (route.query?.type) {
    return Number(route.query?.type)
  } else {
    return SPACE_TYPE_ENUM.PRIVATE
  }
})
const handleSubmit = async (values: any) => {
  const spaceId = space.value?.id
  loading.value = true
  let res
  if (spaceId) {
    res = await updateSpaceUsingPost({
      id: spaceId,
      ...formData.value,
    })
  } else {
    res = await addSpaceUsingPost({
      ...formData.value,
      spaceType: spaceType.value,
    })
  }

  if (res.data.code === 0 && res.data.data) {
    message.success('操作成功')
    router.push(`/space/${res.data.data}`)
  } else {
    message.error('操作失败' + res.data.message)
  }
  loading.value = false
}

const getOldSpace = async () => {
  const spaceId = route.query?.id
  // if (!spaceId) {
  //   return
  // }
  if (spaceId) {
    const res = await getSpaceVoByIdUsingGet({
      id: spaceId,
    })
    if (res.data.code === 0 && res.data.data) {
      const data = res.data.data
      space.value = data
      formData.value.spaceName = data.spaceName
      formData.value.spaceLevel = data.spaceLevel
    }
  }
}
onMounted(() => {
  getOldSpace()
})
const fetchSpaceLevelList = async () => {
  const res = await listSpaceLevelUsingGet()
  if (res.data.code === 0 && res.data.data) {
    spaceLevelList.value = res.data.data
  } else {
    message.error('获取空间级别失败' + res.data.message)
  }
}
onMounted(() => {
  fetchSpaceLevelList()
})
</script>

<template>
  <div id="addSpacePage">
    <h2 style="margin-bottom: 16px">
      {{ route.query.id ? '编辑' : '添加' }} {{ SPACE_TYPE_MAP[spaceType] }}
    </h2>
    <a-form name="basic" layout="vertical" :model="formData" @finish="handleSubmit">
      <a-form-item
        label="空间名称"
        name="spaceName"
        :rules="[{ required: true, message: '请输入空间名称' }]"
      >
        <a-input v-model:value="formData.spaceName" placeholder="请输入空间名称" />
      </a-form-item>
      <a-form-item name="spaceLevel" label="空间级别">
        <a-select
          v-model:value="formData.spaceLevel"
          :options="SPACE_LEVEL_OPTIONS"
          placeholder="请选择空间级别"
          style="min-width: 100px"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%" :loading="loading">
          添加
        </a-button>
      </a-form-item>
    </a-form>
    <a-card title="空间信息">
      <a-typography-paragraph>
        * 目前仅支持开通普通版，如需升级空间，请联系
        <a href="#" target="_blank">Tiamo</a>
      </a-typography-paragraph>
      <a-typography-paragraph v-for="spaceLevel in spaceLevelList">
        {{ spaceLevel.text }}: 大小{{ formatSize(spaceLevel.maxSize) }},数量{{
          spaceLevel.maxCount
        }}
      </a-typography-paragraph>
    </a-card>
  </div>
</template>

<style scoped>
#addSpacePage {
  padding: 20px;
  max-width: 720px;
  margin: 0 auto;
}
</style>
