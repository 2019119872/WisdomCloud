<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import {
  listPictureTagCategoryUsingGet,
  listPictureVoByPageUsingPost,
} from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import PictureList from '@/components/PictureList.vue'

/**
 * 图片数据列表
 */
const dataList = ref<API.Picture[]>([])

/**
 * 数据总数
 */
const total = ref<number>(0)

/**
 * 搜索参数对象，包含分页、排序等信息
 */
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'descend',
})

/**
 * 加载状态标识
 */
const loading = ref(true)

/**
 * 获取图片数据的方法
 * 根据当前搜索条件请求分页数据，并更新页面状态
 */
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

/**
 * 页面挂载时执行数据获取
 */
onMounted(() => {
  fetchData()
})

/**
 * 分页改变时的回调函数
 * @param page 当前页码
 * @param pageSize 每页条数
 */
const onPageChange = (page: number, pageSize: number) => {
  searchParams.current = page
  searchParams.pageSize = pageSize
  fetchData()
}

/**
 * 计算属性：分页配置对象
 * 返回 Ant Design Vue 分页组件所需的配置项
 */
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

/**
 * 路由实例
 */
const router = useRouter()

/**
 * 标签列表
 */
const tagList = ref<string[]>([])

/**
 * 分类列表
 */
const categoryList = ref<string[]>([])

/**
 * 当前选中的分类
 */
const selectedCategory = ref<string>('all')

/**
 * 当前选中的标签布尔数组（用于 CheckableTag 组件绑定）
 */
const selectedTagList = ref<boolean[]>([])

/**
 * 获取标签和分类列表的方法
 * 用于初始化筛选栏中的分类和标签选项
 */
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

/**
 * 页面挂载时加载标签和分类数据
 */
onMounted(() => {
  getTagCategoryList()
})

/**
 * 执行搜索操作
 * 重置页码为第一页并重新获取数据
 */
const doSearch = () => {
  searchParams.current = 1
  fetchData()
}
</script>
<template>
  <div id="homePage">
    <!-- 搜索输入框 -->
    <div class="search-bar">
      <a-input-search
        v-model:value="searchParams.searchText"
        placeholder="从海量图片中搜索"
        enter-button="搜索"
        size="large"
        @search="doSearch"
      />
    </div>
    <!-- 分类标签页 -->
    <a-tabs v-model:active-key="selectedCategory" @change="doSearch">
      <a-tab-pane key="all" tab="全部"></a-tab-pane>
      <a-tab-pane v-for="category in categoryList" :key="category" :tab="category"></a-tab-pane>
      > >
    </a-tabs>
    <!-- 标签筛选栏 -->
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
    <!-- 图片列表组件 -->
    <PictureList :dataList="dataList" :loading="loading" />
    <!-- 分页组件 -->
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
