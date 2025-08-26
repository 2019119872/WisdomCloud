<script lang="ts" setup>
import { useRouter } from 'vue-router'
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  ShareAltOutlined,
} from '@ant-design/icons-vue'
import { deletePictureUsingPost } from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'
import ShareModal from '@/components/ShareModal.vue'
import { ref } from 'vue'

/**
 * 组件属性定义
 * @property {API.PictureVO[]} dataList - 图片数据列表
 * @property {boolean} loading - 是否加载中
 * @property {boolean} showOp - 是否显示操作按钮
 * @property {() => void} onReload - 重新加载数据的回调函数
 * @property {boolean} canEdit - 是否有编辑权限
 * @property {boolean} canDelete - 是否有删除权限
 */
interface Props {
  dataList?: API.PictureVO[]
  loading?: boolean
  showOp?: boolean
  onReload?: () => void
  canEdit?: boolean
  canDelete?: boolean
}

/**
 * 设置组件属性默认值
 */
const props = withDefaults(defineProps<Props>(), {
  dataList: () => [],
  loading: false,
  showOp: false,
  canEdit: false,
  canDelete: false,
})

/**
 * 获取路由实例
 */
const router = useRouter()

/**
 * 点击图片跳转到详情页
 * @param {API.PictureVO} picture - 被点击的图片对象
 */
const doClickPicture = (picture: API.PictureVO) => {
  router.push(`/picture/${picture.id}`)
}

/**
 * 删除图片
 * @param {any} picture - 要删除的图片对象
 * @param {Event} e - 鼠标事件对象
 */
const doDelete = async (picture, e) => {
  e.stopPropagation()
  const id = picture.id
  if (!id) {
    return
  }
  const res = await deletePictureUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    props.onReload?.()
  } else {
    message.error(res.data.message)
  }
}

/**
 * 编辑图片信息
 * @param {any} picture - 要编辑的图片对象
 * @param {Event} e - 鼠标事件对象
 */
const doEdit = (picture, e) => {
  e.stopPropagation()
  router.push({
    path: '/add_picture?id=',
    query: {
      id: picture.id,
      spaceId: picture.spaceId,
    },
  })
}

/**
 * 搜索相似图片
 * @param {any} picture - 用于搜索的图片对象
 * @param {Event} e - 鼠标事件对象
 */
const doSearch = (picture, e) => {
  e.stopPropagation()
  window.open(`/search_picture?pictureId=${picture.id}`)
}

/**
 * 分享模态框引用
 */
const shareModalRef = ref()

/**
 * 分享链接
 */
const shareLink = ref<string>('')

/**
 * 分享图片
 * @param {API.PictureVO} picture - 要分享的图片对象
 * @param {MouseEvent} e - 鼠标事件对象
 */
const doShare = (picture: API.PictureVO, e: MouseEvent) => {
  e.stopPropagation()
  shareLink.value = `${window.location.protocol}//${window.location.host}/picture/${picture.id}`
  if (shareModalRef.value) {
    shareModalRef.value.showModal()
  }
}
</script>
<template>
  <!-- 图片列表容器 -->
  <div class="pictureList">
    <!-- 图片列表组件 -->
    <a-list
      :loading="loading"
      :grid="{ gutter: 4, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
      :data-source="dataList"
    >
      <!-- 列表项渲染模板 -->
      <template #renderItem="{ item: picture }">
        <!-- 列表项 -->
        <a-list-item style="padding: 4px">
          <!-- 图片卡片 -->
          <a-card hoverable @click="doClickPicture(picture)">
            <!-- 图片封面 -->
            <template #cover>
              <img
                :alt="picture.name"
                :src="picture.thumbnailUrl ?? picture.url"
                style="height: 230px; object-fit: cover"
              />
            </template>
            <!-- 图片信息 -->
            <a-card-meta :title="picture.name">
              <template #description>
                <!-- 标签区域 -->
                <a-flex>
                  <a-tag color="green">{{ picture.category ?? '默认分类' }}</a-tag>
                  <a-tag v-for="tag in picture.tags" :key="tag">{{ tag }}</a-tag>
                </a-flex>
              </template>
            </a-card-meta>
            <!-- 操作按钮区域 -->
            <template v-if="showOp" #actions>
              <edit-outlined v-if="canEdit" @click="(e) => doEdit(picture, e)" />
              <delete-outlined v-if="canDelete" @click="(e) => doDelete(picture, e)" />
              <ShareAltOutlined @click="(e) => doShare(picture, e)" />
              <search-outlined @click="(e) => doSearch(picture, e)" />
            </template>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
    <!-- 分享模态框组件 -->
    <ShareModal ref="shareModalRef" :link="shareLink" />
  </div>
</template>
<style scoped></style>
