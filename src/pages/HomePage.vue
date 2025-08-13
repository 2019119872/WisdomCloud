<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import {
  listPictureTagCategoryUsingGet,
  listPictureVoByPageUsingPost,
} from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import PictureList from '@/components/PictureList.vue'

const dataList = ref<API.Picture[]>([])
const total = ref<number>(0)
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'descend',
})
const loading = ref(true)
// 修复后的fetchData方法
const fetchData = async () => {
  loading.value = true
  // 复制基础搜索参数
  const params = { ...searchParams }
  // 处理分类筛选（如果不是"all"则添加分类条件）
  if (selectedCategory.value !== 'all') {
    params.category = selectedCategory.value
  } else {
    // 清除分类条件
    delete params.category
  }
  // 处理标签筛选（收集选中的标签）
  const selectedTags = tagList.value.filter((_, index) => selectedTagList.value[index])
  if (selectedTags.length > 0) {
    params.tags = selectedTags // 正确传递标签数组
  } else {
    // 清除标签条件
    delete params.tags
  }

  try {
    const res = await listPictureVoByPageUsingPost(params)
    if (res.data.code === 0 && res.data.data) {
      dataList.value = res.data.data.records ?? []
      total.value = res.data.data.total ?? 0
    } else {
      message.error(res.data.message || '获取数据失败')
    }
  } catch (error) {
    message.error('网络错误，获取数据失败')
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
const onPageChange = (page: number, pageSize: number) => {
  searchParams.current = page
  searchParams.pageSize = pageSize
  fetchData()
}

const pagination = computed(() => {
  return {
    current: searchParams.current,
    pageSize: searchParams.pageSize,
    total: total.value,
    // 修复：调整参数顺序，Ant Design Vue 的 onChange 第一个参数是页码，第二个是页大小
    onChange: (page: number, pageSize: number) => {
      searchParams.current = page // 正确接收页码参数
      searchParams.pageSize = pageSize
      fetchData()
    },
    // 添加 showSizeChanger 确保页码变更可见
    // showSizeChanger: true,
    // 添加分页信息展示
    // showTotal: (total) => `共 ${total} 条数据`
  }
})
const router = useRouter()

const tagList = ref<string[]>([])
const categoryList = ref<string[]>([])
const selectedCategory = ref<string>('all')
const selectedTagList = ref<boolean[]>([])
const getTagCategoryList = async () => {
  try {
    const res = await listPictureTagCategoryUsingGet()
    if (res && res.data && res.data.code === 0) {
      const data = res.data.data || {}
      tagList.value = data.tagList ?? []
      // 现在赋值类型与categoryOptions的定义匹配
      categoryList.value = data.categoryList ?? []
    }
  } catch (error) {
    console.error('获取标签和分类失败：', error)
  }
}

onMounted(() => {
  getTagCategoryList()
})

const doSearch = () => {
  searchParams.current = 1
  fetchData()
}
</script>
<template>
  <div id="homePage">
    <div class="search-bar">
      <a-input-search
        v-model:value="searchParams.searchText"
        placeholder="从海量图片中搜索"
        enter-button="搜索"
        size="large"
        @search="doSearch"
      />
    </div>
    <a-tabs v-model:active-key="selectedCategory" @change="doSearch">
      <a-tab-pane key="all" tab="全部"></a-tab-pane>
      <a-tab-pane v-for="category in categoryList" :key="category" :tab="category"></a-tab-pane>
      > >
    </a-tabs>
    <div class="tag-bar">
      <span style="margin-right: 8px">标签:</span>
      <a-space :size="[0, 8]" wrap>
        <a-checkable-tag
          v-for="(tag, index) in tagList"
          :key="tag"
          v-model:checked="selectedTagList[index]"
          @change="doSearch"
        >
          {{ tag }}
        </a-checkable-tag>
      </a-space>
    </div>
    <PictureList :dataList="dataList" :loading="loading" />
    <a-pagination
      v-model:current="searchParams.current"
      v-model:page-size="searchParams.pageSize"
      :total="total"
      @change="onPageChange"
      style="text-align: right"
    />
  </div>
</template>
<style scoped>
#homePage {
  margin-bottom: 20px;
}

#homePage .search-bar {
  max-width: 480px;
  margin: 0 auto 8px;
}

#homePage .tag-bar {
  margin-bottom: 8px;
}
</style>
