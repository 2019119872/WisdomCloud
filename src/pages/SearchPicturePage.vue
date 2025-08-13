<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getPictureVoByIdUsingGet, searchPictureByPictureUsingPost } from '@/api/pictureController'
import { message } from 'ant-design-vue'
const route = useRoute()
const pictureId = computed(() => {
  return route.query?.pictureId
})

const picture = ref<API.PictureVO>({})
const dataList = ref<API.ImageSearchResult[]>([])
const loading = ref<boolean>(false)
// 获取老数据 - 修复：添加错误处理和类型检查
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

onMounted(() => {
  getOldPicture()
  fetchData()
})


</script>
<template>
  <div id="searchPicturePage">
    <h2 style="margin-bottom: 16px">以图搜图</h2>
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
    <h3 style="margin: 16px 0">识图结果</h3>
    <!-- 图片列表 -->
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
      :data-source="dataList"
      :loading="loading"
    >
      <template #renderItem="{ item }">
        <a-list-item style="padding: 0">
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
