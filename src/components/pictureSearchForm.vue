<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import dayjs from 'dayjs'
import { listPictureTagCategoryUsingGet } from '@/api/pictureController.ts'

/**
 * 组件属性定义
 * @property {Function} onSearch - 搜索回调函数，接收搜索参数对象
 */
interface Props {
  onSearch?: (searchParams: API.PictureQueryRequest) => void
}

const props = defineProps<Props>()

// 搜索参数响应式对象
const searchParams = reactive<API.PictureQueryRequest>({})

/**
 * 执行搜索操作
 * 调用父组件传入的onSearch回调函数，传递当前搜索参数
 */
const doSearch = () => {
  props.onSearch?.(searchParams)
}

// 日期范围选择器绑定值
const dataRange = ref<[]>([])

/**
 * 日期范围更改处理函数
 * 当用户选择日期范围时，更新搜索参数中的开始和结束编辑时间
 * @param dates - 选中的日期对象数组
 * @param dateStrings - 选中的日期字符串数组
 */
const onRangeChange = (dates: any[], dateStrings: string[]) => {
  if (dates?.length >= 2) {
    searchParams.startEditTime = dates[0].toDate()
    searchParams.endEditTime = dates[1].toDate()
  } else {
    searchParams.startEditTime = undefined
    searchParams.endEditTime = undefined
  }
}

// 日期范围引用（未使用）
const dateRange = ref<[]>([])

/**
 * 日期范围更改时触发
 * @param dates
 * @param dateStrings
 */
const rangePresets = ref([
  { label: '过去 7 天', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: '过去 14 天', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: '过去 30 天', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: '过去 90 天', value: [dayjs().add(-90, 'd'), dayjs()] },
])

// 标签选项列表
const tagOptions = ref<{ label: string; value: string }[]>([])

// 分类选项列表
const categoryOptions = ref<{ label: string; value: string }[]>([])

/**
 * 获取标签和分类选项数据
 * 从API获取标签和分类列表，并转换为下拉选项格式
 * @returns {Promise<void>}
 */
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

// 组件挂载时获取标签和分类选项
onMounted(() => {
  getTagCategoryOptions()
})

/**
 * 清空搜索条件
 * 重置所有搜索参数和日期范围选择器
 */
const doClear = () => {
  Object.keys(searchParams).forEach((key) => {
    searchParams[key] = undefined
  })
  dataRange.value = []
  props.onSearch?.(searchParams)
}
</script>

<template>
  <div class="pictureSearchForm">
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="关键词">
        <a-input
          style="max-width: 180px"
          v-model:value="searchParams.searchText"
          placeholder="输入关键词"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="分类" name="category">
        <a-auto-complete
          v-model:value="searchParams.category"
          :options="categoryOptions"
          placeholder="请输入分类"
          style="min-width: 180px"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="标签" name="tags">
        <a-select
          v-model:value="searchParams.tags"
          :options="tagOptions"
          mode="tags"
          placeholder="请输入标签"
          style="min-width: 180px"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="日期" name="dataRange">
        <a-range-picker
          style="width: 400px"
          show-time
          v-model:value="dataRange"
          :placeholder="['编辑开始时间', '编辑结束时间']"
          format="YYYY/MM/DD HH:mm:ss"
          :presets="rangePresets"
          @change="onRangeChange"
        />
      </a-form-item>
      <a-form-item label="名称" name="name">
        <a-input v-model:value="searchParams.name" placeholder="请输入名称" allow-clear />
      </a-form-item>
      <a-form-item label="简介" name="introduction">
        <a-input v-model:value="searchParams.introduction" placeholder="请输入简介" allow-clear />
      </a-form-item>
      <a-form-item label="宽度" name="picWidth">
        <a-input-number v-model:value="searchParams.picWidth" />
      </a-form-item>
      <a-form-item label="高度" name="picHeight">
        <a-input-number v-model:value="searchParams.picHeight" />
      </a-form-item>
      <a-form-item label="格式" name="picFormat">
        <a-input v-model:value="searchParams.picFormat" placeholder="请输入格式" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button type="primary" html-type="submit">搜索</a-button>
          <a-button html-type="reset" @click="doClear">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
.pictureSearchForm .ant-form-item {
  margin-bottom: 16px;
}
</style>
