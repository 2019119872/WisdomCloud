<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getPictureVoByIdUsingGet, searchPictureByPictureUsingPost } from '@/api/pictureController'
import { message } from 'ant-design-vue'

/**
 * 获取当前路由对象，用于读取查询参数
 */
const route = useRoute()

/**
 * 计算属性：从路由中提取 pictureId 查询参数
 * @returns {string | undefined} 图片ID
 */
const pictureId = computed(() => {
  return route.query?.pictureId
})

/**
 * 响应式变量：存储原始图片信息
 */
const picture = ref<API.PictureVO>({})

/**
 * 响应式变量：存储搜索结果列表
 */
const dataList = ref<API.ImageSearchResult[]>([])

/**
 * 响应式变量：控制加载状态
 */
const loading = ref<boolean>(false)

/**
 * 获取原始图片信息
 * 通过 pictureId 调用接口获取图片详细信息，并更新 picture 响应式变量
 * 包含错误处理和参数校验逻辑
 */
const getOldPicture = async () => {
  try {
    const id = pictureId.value
    if (id) {
      const res = await getPictureVoByIdUsingGet({
        id: id,
      })
      if (res.data.code === 0 && res.data.data) {
        picture.value = res.data.data
      } else {
        message.error(res.data.message || '获取图片信息失败')
      }
    } else {
      message.warning('缺少图片ID参数')
    }
  } catch (error: any) {
    message.error(`获取图片信息出错: ${error.message || '未知错误'}`)
  }
}

/**
 * 根据图片ID执行以图搜图操作
 * 调用接口获取相似图片列表并更新 dataList 响应式变量
 * 包含加载状态控制和错误处理
 */
const fetchData = async () => {
  loading.value = true
  try {
    const id = pictureId.value
    if (!id) {
      message.warning('缺少图片ID，无法搜索')
      return
    }

    const res = await searchPictureByPictureUsingPost({
      pictureId: id,
    })

    if (res.data.code === 0 && res.data.data) {
      dataList.value = res.data.data
    } else {
      message.error(`获取数据失败: ${res.data.message || '未知错误'}`)
    }
  } catch (error: any) {
    message.error(`搜索出错: ${error.message || '未知错误'}`)
  }
  loading.value = false
}

/**
 * 组件挂载时执行初始化操作
 * 同时获取原始图片信息和搜索结果数据
 */
onMounted(() => {
  getOldPicture()
  fetchData()
})
</script>
<template>
  <div id="searchPicturePage">
    <!-- 页面标题 -->
    <h2 style="margin-bottom: 16px">以图搜图</h2>

    <!-- 显示原始图片区域 -->
    <h3 style="margin: 16px 0">原图</h3>
    <a-card style="width: 240px">
      <template #cover>
        <img
          style="height: 180px; object-fit: cover"
          :alt="picture.name"
          :src="picture.thumbnailUrl ?? picture.url"
        />
      </template>
    </a-card>

    <!-- 搜索结果展示区域 -->
    <h3 style="margin: 16px 0">识图结果</h3>

    <!-- 使用列表组件展示搜索到的图片 -->
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
      :data-source="dataList"
      :loading="loading"
    >
      <template #renderItem="{ item }">
        <a-list-item style="padding: 0">
          <!-- 点击可跳转至来源链接 -->
          <a :href="item.fromUrl" target="_blank">
            <a-card>
              <template #cover>
                <img style="height: 180px; object-fit: cover" :src="item.thumbUrl" />
              </template>
            </a-card>
          </a>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<style scoped>
#searchPicturePage {
  margin: 20px;
  padding-bottom: 20px;
}
</style>
