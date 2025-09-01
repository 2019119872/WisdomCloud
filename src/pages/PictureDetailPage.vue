<script lang="ts" setup>
import { computed, h, onMounted, ref } from 'vue'
import { deletePictureUsingPost, getPictureVoByIdUsingGet } from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'
import { downloadImage, formatSize } from '@/utils/index.ts'
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  ShareAltOutlined,
} from '@ant-design/icons-vue'
import router from '@/router'
import ShareModal from '@/components/ShareModal.vue'
import { SPACE_PERMISSION_ENUM } from '@/constants/space.ts'

/**
 * 组件属性定义
 */
interface Props {
  /**
   * 图片ID，用于获取图片详情
   */
  id: number | string
}

/**
 * 定义组件接收的属性
 */
const props = defineProps<Props>()

/**
 * 存储图片详情数据
 */
const picture = ref<API.PictureVO>({})

/**
 * 获取图片详细信息
 *
 * 通过调用后端接口获取指定ID的图片详细信息，并更新到picture响应式变量中。
 * 如果请求失败，则显示错误提示信息。
 */
const fetchPictureDetail = async () => {
  try {
    const res = await getPictureVoByIdUsingGet({
      id: props.id,
    })
    if (res.data.code === 0) {
      if (res.data.data) {
        picture.value = res.data.data
      }
    }
  } catch (e: any) {
    message.error('获取图片详细失败', e.message)
  }
}

/**
 * 在组件挂载时执行图片详情获取操作
 */
onMounted(() => {
  fetchPictureDetail()
})

/**
 * 删除当前图片
 *
 * 调用删除接口删除当前展示的图片，删除成功后跳转到首页。
 * 如果删除失败，则显示错误提示信息。
 */
const doDelete = async () => {
  const id = picture.value.id
  if (!id) {
    return
  }
  const res = await deletePictureUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    router.push('/homePage')
  } else {
    message.error(res.data.message)
  }
}

/**
 * 编辑当前图片
 *
 * 跳转到编辑页面，携带图片ID和空间ID作为查询参数。
 */
const doEdit = () => {
  router.push({
    path: '/add_picture',
    query: {
      id: picture.value.id,
      spaceId: picture.value.spaceId,
    },
  })
}

/**
 * 下载当前图片
 *
 * 使用工具函数下载图片，传入图片URL和图片名称。
 */
const doDownload = () => {
  downloadImage(picture.value.url, picture.value.name)
}

/**
 * 分享模态框引用
 */
const shareModalRef = ref()

/**
 * 分享链接地址
 */
const shareLink = ref<string>()

/**
 * 执行分享操作
 *
 * 构造分享链接并显示分享模态框。
 */
const doShare = () => {
  shareLink.value = `${window.location.protocol}//${window.location.host}/picture/${picture.value.id}`
  if (shareModalRef.value) {
    shareModalRef.value.showModal()
  }
}

/**
 * 创建权限检查函数
 *
 * @param permission 权限标识符
 * @returns 返回一个计算属性，表示是否拥有该权限
 */
function createPermissionChecker(permission: string) {
  return computed(() => {
    return (picture.value.permissionList ?? []).includes(permission)
  })
}

/**
 * 检查是否有编辑权限
 */
const canEdit = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_EDIT)

/**
 * 检查是否有删除权限
 */
const canDelete = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_DELETE)
</script>
<template>
  <div id="pictureDetailPage">
    <a-row :gutter="[16, 16]">
      <!-- 图片展示区 -->
      <a-col :sm="24" :md="16" :xl="18">
        <a-card title="图片预览">
          <a-image style="max-height: 600px; object-fit: contain" :src="picture.url" />
        </a-card>
      </a-col>
      <!-- 图片信息区 -->
      <a-col :sm="24" :md="8" :xl="6">
        <a-card title="图片信息">
          <a-descriptions :column="1">
            <a-descriptions-item label="作者">
              <a-space>
                <a-avatar :size="24" :src="picture.user?.userAvatar" />
                <div>{{ picture.user?.userName }}</div>
              </a-space>
            </a-descriptions-item>
            <a-descriptions-item label="名称">
              {{ picture.name ?? '未命名' }}
            </a-descriptions-item>
            <a-descriptions-item label="简介">
              {{ picture.introduction ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="分类">
              {{ picture.category ?? '默认' }}
            </a-descriptions-item>
            <a-descriptions-item label="标签">
              <a-tag v-for="tag in picture.tags" :key="tag">
                {{ tag }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="格式">
              {{ picture.picFormat ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="宽度">
              {{ picture.picWidth ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="高度">
              {{ picture.picHeight ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="宽高比">
              {{ picture.picScale ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="大小">
              {{ formatSize(picture.picSize) }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
        <a-space wrap>
          <a-button type="primary" size="middle" @click="doDownload">
            免费下载
            <template #icon>
              <DownloadOutlined />
            </template>
          </a-button>
          <a-button v-if="canDelete" :icon="h(DeleteOutlined)" danger @click="doDelete"
            >删除
          </a-button>
          <a-button v-if="canEdit" type="default" :icon="h(EditOutlined)" @click="doEdit"
            >编辑
          </a-button>
          <a-button style="color: deepskyblue" :icon="h(ShareAltOutlined)" @click="doShare"
            >分享
          </a-button>
        </a-space>
      </a-col>
    </a-row>
    <ShareModal ref="shareModalRef" :link="shareLink" />
  </div>
</template>
<style scoped>
#pictureDetailPage {
  margin-bottom: 20px;
}
</style>
